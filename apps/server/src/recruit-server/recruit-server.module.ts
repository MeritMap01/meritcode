import { Module } from '@nestjs/common';
import { RecruitControllerController } from './recruit-controller/recruit-controller.controller';
import { AuthModule } from "@/server/auth/auth.module";
import { ResumeService } from "../resume/resume.service";
import { PrinterModule } from "@/server/printer/printer.module";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [AuthModule, PrinterModule, StorageModule],
  providers: [ResumeService],
  exports: [ResumeService],
  controllers: [RecruitControllerController]
})
export class RecruitServerModule {}
