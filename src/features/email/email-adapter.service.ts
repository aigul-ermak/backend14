import {Injectable} from "@nestjs/common";
import nodemailer from 'nodemailer';
import * as process from "process";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class EmailAdapter {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>(' emailSettings.EMAIL_USER'),
                pass: this.configService.get<string>(' emailSettings.EMAIL_PASS'),
            },
        });
    }

    async sendEmail(to: string, subject: string, message: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                html: message,
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}