import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserViewData } from '../Users/types';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendLicenseKey(user: UserViewData, key: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'WBChat license key',
      template: './license_key_email',
      context: {
        username: user.username,
        key,
      },
    });
  }
}