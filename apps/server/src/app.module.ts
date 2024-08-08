import { HttpException, Module } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { RavenInterceptor, RavenModule } from "nest-raven";
import { ZodValidationPipe } from "nestjs-zod";
import { join } from "path";

import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { ConfigModule } from "./config/config.module";
import { ContributorsModule } from "./contributors/contributors.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { MailModule } from "./mail/mail.module";
import { PrinterModule } from "./printer/printer.module";
import { ResumeModule } from "./resume/resume.module";
import { StorageModule } from "./storage/storage.module";
import { TranslationModule } from "./translation/translation.module";
import { UserModule } from "./user/user.module";
import { UtilsModule } from "./utils/utils.module";
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    // Core Modules
    ConfigModule,
    DatabaseModule,
    MailModule,
    RavenModule,
    CacheModule,
    UtilsModule,
    HealthModule,

    // Feature Modules
    AuthModule.register(),
    UserModule,
    ResumeModule,
    StorageModule,
    PrinterModule,
    TranslationModule,
    ContributorsModule,
    SearchModule,

    // Static Assets
    ServeStaticModule.forRoot({
      serveRoot: "/artboard",
      rootPath: join(__dirname, "..", "artboard"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/home",
      rootPath: join(__dirname, "../../..", "staticHtml/home"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/blog",
      rootPath: join(__dirname, "../../..", "staticHtml/blog"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/pricing",
      rootPath: join(__dirname, "../../..", "staticHtml/pricing"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/contactus",
      rootPath: join(__dirname, "../../..", "staticHtml/contactus"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/features",
      rootPath: join(__dirname, "../../..", "staticHtml/features"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/privacy",
      rootPath: join(__dirname, "../../..", "staticHtml/privacy"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/terms",
      rootPath: join(__dirname, "../../..", "staticHtml/tac"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/article",
      rootPath: join(__dirname, "../../..", "staticHtml/article"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/*",
      rootPath: join(__dirname, "..", "client"),
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        filters: [
          // Filter all HttpException with status code <= 500
          {
            type: HttpException,
            filter: (exception: HttpException) => exception.getStatus() < 500,
          },
        ],
      }),
    },
  ],
})
export class AppModule {}
