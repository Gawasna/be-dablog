import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendOtpEmail(email: string, otp: string) {
        await this.mailerService.sendMail({
            from: 'Gawasuna',
            to: email,
            subject: 'Gawasuna Sercurity Team',
            text: 'OTP Code',
            html: `
                <h2 style="color: #4CAF50;">Dablog OTP Code</h2>
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #4CAF50;">Dablog-project Password Reset</h2>
                    <p>Dear user,</p>
                    <p>You requested to reset your password. Please use the OTP code below to proceed:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #333; margin: 10px 0;">
                        ${otp}
                    </div>
                    <p>This code is valid for 5 minutes. If you did not request a password reset, please ignore this email.</p>
                    <p style="margin-top: 20px; color: #777;">Best regards,<br>Dablog-project Team</p>
                </div>
            `,
        });
    }

    async sendPasswordResetConfirmation(email: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Password Reset Confirmation',
            text: 'Your password has been successfully reset.',
            html: '<p>Your password has been successfully reset.</p>',
        });
    }
}
