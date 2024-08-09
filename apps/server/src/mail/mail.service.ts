import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService, ISendMailOptions } from "@nestjs-modules/mailer";
import sgMail, { MailDataRequired } from '@sendgrid/mail';

import { Config } from "@/server/config/schema";

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly mailerService: MailerService,
  ) { }

  async sendEmail(options: ISendMailOptions) {
    const smtpUrl = this.configService.get("SMTP_URL");

    if (!smtpUrl) {
      return Logger.log(options, "MailService#sendEmail");
    }

    return await this.mailerService.sendMail(options);
  }

  async sendGridMail(options: MailDataRequired) {
    try {
      await sgMail.send(options);
      Logger.log(`Email sent to ${options.to}`, "MailService#sendGridEmail");
    } catch (error) {
      Logger.error(`Failed to send email: ${error}`, "MailService#sendGridEmail");
    }
  }
}
