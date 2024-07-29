import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { StorageModule } from "../storage/storage.module";
import { PrinterService } from "./printer.service";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [HttpModule, StorageModule,MailModule],
  providers: [PrinterService],
  exports: [PrinterService],
})
export class PrinterModule {}
