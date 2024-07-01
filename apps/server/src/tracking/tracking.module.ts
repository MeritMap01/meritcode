// tracking.module.ts
import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { PrismaService } from "nestjs-prisma";

@Module({
  providers: [TrackingService,PrismaService],
  controllers: [TrackingController],
})
export class TrackingModule {}
