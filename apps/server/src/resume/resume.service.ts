import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateResumeDto, ImportResumeDto, ResumeDto, UpdateResumeDto } from "@reactive-resume/dto";
import { defaultResumeData, ResumeData } from "@reactive-resume/schema";
import type { DeepPartial } from "@reactive-resume/utils";
import { generateRandomName, kebabCase } from "@reactive-resume/utils";
import { ErrorMessage } from "@reactive-resume/utils";
import { RedisService } from "@songkeys/nestjs-redis";
import deepmerge from "deepmerge";
import Redis from "ioredis";
import { PrismaService } from "nestjs-prisma";

import { PrinterService } from "@/server/printer/printer.service";
import { MailService } from "../mail/mail.service";
import { ConfigService } from "@nestjs/config";

import { StorageService } from "../storage/storage.service";
import { UtilsService } from "../utils/utils.service";
import { Config } from "../config/schema";

@Injectable()
export class ResumeService {
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly printerService: PrinterService,
    private readonly storageService: StorageService,
    private readonly redisService: RedisService,
    private readonly utils: UtilsService,
    private readonly mailService:MailService,
    private readonly configService:ConfigService<Config>
  ) {
    this.redis = this.redisService.getClient();
  }

  async create(userId: string, createResumeDto: CreateResumeDto) {
    const { name, email, picture } = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, email: true, picture: true },
    });

    const data = deepmerge(defaultResumeData, {
      basics: { name, email, picture: { url: picture ?? "" } },
    } satisfies DeepPartial<ResumeData>);

    const resume = await this.prisma.resume.create({
      data: {
        data,
        userId,
        title: createResumeDto.title,
        visibility: createResumeDto.visibility,
        slug: createResumeDto.slug ?? kebabCase(createResumeDto.title),
      },
    });

    await Promise.all([
      this.redis.del(`user:${userId}:resumes`),
      this.redis.set(`user:${userId}:resume:${resume.id}`, JSON.stringify(resume)),
    ]);

    return resume;
  }

  async import(userId: string, importResumeDto: ImportResumeDto) {
    const randomTitle = generateRandomName();

    const resume = await this.prisma.resume.create({
      data: {
        userId,
        visibility: "private",
        data: importResumeDto.data,
        title: importResumeDto.title || randomTitle,
        slug: importResumeDto.slug || kebabCase(randomTitle),
      },
    });

    await Promise.all([
      this.redis.del(`user:${userId}:resumes`),
      this.redis.set(`user:${userId}:resume:${resume.id}`, JSON.stringify(resume)),
    ]);

    return resume;
  }

  findAll(userId: string) {
    return this.utils.getCachedOrSet(`user:${userId}:resumes`, () =>
      this.prisma.resume.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }),
    );
  }

  findOne(id: string, userId?: string) {
    if (userId) {
      return this.utils.getCachedOrSet(`user:${userId}:resume:${id}`, () =>
        this.prisma.resume.findUniqueOrThrow({
          where: { userId_id: { userId, id } },
        }),
      );
    }

    return this.utils.getCachedOrSet(`user:public:resume:${id}`, () =>
      this.prisma.resume.findUniqueOrThrow({
        where: { id },
      }),
    );
  }

  async findOneStatistics(userId: string, id: string) {
    const result = await Promise.all([
      this.redis.get(`user:${userId}:resume:${id}:views`),
      this.redis.get(`user:${userId}:resume:${id}:downloads`),
    ]);

    const [views, downloads] = result.map((value) => Number(value) || 0);

    return { views, downloads };
  }

  async findOneByUsernameSlug(username: string, slug: string, userId?: string) {
    const resume = await this.prisma.resume.findFirstOrThrow({
      where: { user: { username }, slug, visibility: "public" },
    });

    // Update statistics: increment the number of views by 1
    if (!userId) await this.redis.incr(`user:${resume.userId}:resume:${resume.id}:views`);

    return resume;
  }

  async update(userId: string, id: string, updateResumeDto: UpdateResumeDto) {
    try {
      const { locked } = await this.prisma.resume.findUniqueOrThrow({
        where: { id },
        select: { locked: true },
      });

      if (locked) throw new BadRequestException(ErrorMessage.ResumeLocked);

      const resume = await this.prisma.resume.update({
        data: {
          title: updateResumeDto.title,
          slug: updateResumeDto.slug,
          visibility: updateResumeDto.visibility,
          data: updateResumeDto.data as unknown as Prisma.JsonObject,
        },
        where: { userId_id: { userId, id } },
      });

      await Promise.all([
        this.redis.set(`user:${userId}:resume:${id}`, JSON.stringify(resume)),
        this.redis.del(`user:${userId}:resumes`),
        this.redis.del(`user:${userId}:storage:resumes:${id}`),
        this.redis.del(`user:${userId}:storage:previews:${id}`),
      ]);

      return resume;
    } catch (error) {
      if (error.code === "P2025") {
        Logger.error(error);
        throw new InternalServerErrorException(error);
      }
    }
  }

  async lock(userId: string, id: string, set: boolean) {
    const resume = await this.prisma.resume.update({
      data: { locked: set },
      where: { userId_id: { userId, id } },
    });

    await Promise.all([
      this.redis.set(`user:${userId}:resume:${id}`, JSON.stringify(resume)),
      this.redis.del(`user:${userId}:resumes`),
    ]);

    return resume;
  }

  async remove(userId: string, id: string) {
    await Promise.all([
      // Remove cached keys
      this.redis.del(`user:${userId}:resumes`),
      this.redis.del(`user:${userId}:resume:${id}`),

      // Remove files in storage, and their cached keys
      this.storageService.deleteObject(userId, "resumes", id),
      this.storageService.deleteObject(userId, "previews", id),
    ]);

    return this.prisma.resume.delete({ where: { userId_id: { userId, id } } });
  }

  async printResume(resume: ResumeDto, userId?: string) {
    const url = await this.printerService.printResume(resume);
    const userDownloads =await this.prisma.featureAccess.findUniqueOrThrow({
      where:{id:userId}
    })

    const user = await this.prisma.user.findUnique({
      where:{id:userId}
    })

    // const emailData={
    //   to: user?.email,
    //   from:{
    //     name:"theResume",
    //     email:this.configService.get("MAIL_FROM")
    //   },
    //   templateId:"d-bb5d5a751c8b4e019965cbf4eae3dd42",
    //   dynamicTemplateData:{
    //     subject:"Congratulations 🎉 🥳",
    //     message:"Congratulations on Your Milestone Achievement!",
    //     buttonContent:"CONTINUE",
    //     content1:"We are thrilled to celebrate your recent milestone with you! Your dedication and effort in creating impressive resumes have not gone unnoticed.",
    //     content2:"At theResume, we strive to support your career journey, and it's wonderful to see you taking full advantage of our platform's features. Keep up the great work and continue to build on your successes.",
    //     buttonUrl:"https://theresume.io/dashboard/resumes"
    //   }
    // }

    // if(userDownloads.downloadCount===4){
    //   this.mailService.sendGridMail(emailData)
    // }

    // Update statistics: increment the number of downloads by 1
    if (!userId) await this.redis.incr(`user:${resume.userId}:resume:${resume.id}:downloads`);

    return url;
  }

  printPreview(resume: ResumeDto) {
    return this.printerService.printPreview(resume);
  }
}
