import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {EMAIL_USER, EMAIL_PASS} from "../../secrets"
dotenv.config();

export interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
  attachments?: any[];
}

export interface EmailTemplate {
  subject: string;
  html: (data: any) => string;
}

export const getEmailConfig = (): EmailConfig => {
  return {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: EMAIL_USER || '',
      pass: EMAIL_PASS || ''
    }
  };
};

export const createTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport(config);
};

export const defaultFrom = (): string => {
  return EMAIL_USER || 'noreply@acsp.org';
};