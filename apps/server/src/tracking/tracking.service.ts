import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { RedisService } from "./redis.service"; // Import your Redis service

@Injectable()
export class TrackingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService // Inject your Redis service
  ) {}

  async updateDownloadCount(resumeId: string, userId?: string) {
    try {
      // Increment download count in Redis if userId is provided
      if (userId) {
        await this.redis.incr(`user:${userId}:resume:${resumeId}:downloads`);
      }

      // Update download count in database using Prisma
      const updatedResume = await this.prisma.resume.update({
        where: { id: resumeId },
        data: {
          // Use a transaction to update the download count
          // Here, fetch the current download count and update it
          downloads: {
            increment: 1,
          },
        },
      });

      return updatedResume;
    } catch (error) {
      throw new Error(`Failed to update download count: ${error.message}`);
    }
  }

  async getDownloadInfo(resumeId: string, userId?: string) {
    try {
      // Fetch resume information for download status
      const resume = await this.prisma.resume.findUnique({
        where: { id: resumeId },
        select: {
          userId: true,
          downloads: true,
        },
      });

      if (!resume) {
        throw new Error(`Resume with ID ${resumeId} not found.`);
      }

      // Fetch download count from Redis if userId is provided
      let downloadsFromRedis = 0;
      if (userId) {
        downloadsFromRedis = await this.redis.get(`user:${userId}:resume:${resumeId}:downloads`);
      }

      // Determine total downloads (database + Redis)
      const totalDownloads = resume.downloads + (downloadsFromRedis ? parseInt(downloadsFromRedis, 10) : 0);

      return {
        resumeId: resumeId,
        userId: resume.userId,
        downloads: totalDownloads,
      };
    } catch (error) {
      throw new Error(`Failed to fetch download info: ${error.message}`);
    }
  }
}
