import { Controller, Get, Param, Post } from "@nestjs/common";
import { TrackingService } from "./tracking.service";

@Controller("tracking")
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post("update/:userId")
  async updateDownloadCount(@Param("userId") userId: string) {
    return this.trackingService.updateDownloadCount(userId);
  }

  @Get("info/:userId")
  async getDownloadInfo(@Param("userId") userId: string) {
    return this.trackingService.getDownloadInfo(userId);
  }
}
