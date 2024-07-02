import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule, PrismaService } from "nestjs-prisma";

import { RazorPayController } from "./payment.controller";
import { RazorPayService } from "./payment.service";

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [RazorPayService, PrismaService],
  controllers: [RazorPayController],
  exports: [RazorPayService],
})
export class RazorPayModule { }
