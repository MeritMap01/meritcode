import { Module } from "@nestjs/common";
import { RazorPayService } from "./payment.service";
import { RazorPayController } from "./payment.controller";
import { PrismaModule, PrismaService } from "nestjs-prisma";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
	imports: [
		ConfigModule,
		PrismaModule
	], providers: [RazorPayService, PrismaService],
	controllers: [RazorPayController],
	exports: [RazorPayService],
})

export class RazorPayModule { }