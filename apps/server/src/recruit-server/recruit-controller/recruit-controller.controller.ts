import { Controller, Get, UseGuards } from '@nestjs/common';
import { TwoFactorGuard } from "../../auth/guards/two-factor.guard";
import { EmailVerificationGuard } from "../../resume/guards/emailVerification.guard";
import { User as UserEntity } from "@prisma/client";
import { User } from "@/server/user/decorators/user.decorator";
import { ResumeService } from '@/server/resume/resume.service';

@Controller('recruit')
export class RecruitControllerController {
    constructor(
        private readonly resumeService: ResumeService,
      ) {}
    
    @Get("finduser")
    // @UseGuards(TwoFactorGuard,EmailVerificationGuard)
    findAll(@User() user: UserEntity) {
      return "Hello World";
      // return this.resumeService.findAll(user.id);
    }
}
