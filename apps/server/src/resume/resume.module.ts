import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";
import { PrinterModule } from "@/server/printer/printer.module";

import { StorageModule } from "../storage/storage.module";
import { ResumeController } from "./resume.controller";
import { ResumeService } from "./resume.service";
import { MailModule } from "../mail/mail.module";
import { MailService } from "@sendgrid/mail";

@Module({
  imports: [AuthModule, PrinterModule, StorageModule,MailModule],
  controllers: [ResumeController],
  providers: [ResumeService,MailService],
  exports: [ResumeService],
})
export class ResumeModule {}
