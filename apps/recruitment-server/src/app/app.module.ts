import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {AuthModule} from "@/server/auth/auth.module";
import { DatabaseModule } from '@/server/database/database.module';
import { CacheModule } from '@/server/cache/cache.module';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
