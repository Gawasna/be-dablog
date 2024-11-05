// mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.GOOGLE_MAIL_CLIENT,
                    pass: process.env.GOOGLE_MAIL_KEY,
                },
            },
            defaults: {
                from: '"No Reply" <hunglepy05@gmail.com>',
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
