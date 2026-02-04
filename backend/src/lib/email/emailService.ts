import { createTransporter, defaultFrom, EmailOptions } from './config';
import { EmailTemplates } from './templates';

export class EmailService {
  private transporter;
  private defaultFromEmail: string;

  constructor() {
    this.transporter = createTransporter();
    this.defaultFromEmail = defaultFrom();
  }

  /**
   * Send an email using a template
   */
  async sendTemplateEmail(
    templateKey: keyof typeof EmailTemplates,
    to: string | string[],
    data: any,
    options?: Partial<EmailOptions>
  ): Promise<boolean> {
    try {
      const template = EmailTemplates[templateKey];
      
      const recipients = Array.isArray(to) ? to.join(', ') : to;
      
      // Handle subject - template.subject is always a string in your case
      const subject = template.subject;
      
      const emailOptions: EmailOptions = {
        from: options?.from || this.defaultFromEmail,
        to: recipients,
        subject: subject, 
        html: template.html(data),
        cc: options?.cc,
        bcc: options?.bcc,
        attachments: options?.attachments,
      };

      await this.transporter.sendMail(emailOptions);
      console.log(`✅ Email sent successfully (${templateKey}) to: ${recipients}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send email (${templateKey}):`, error);
      return false;
    }
  }

  /**
   * Send a custom email
   */
  async sendCustomEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Destructure to handle 'from' properly
      const { from, ...restOptions } = options;
      
      await this.transporter.sendMail({
        from: from || this.defaultFromEmail,  // Use provided from or default
        ...restOptions
      });
      console.log(`✅ Custom email sent to: ${options.to}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send custom email:', error);
      return false;
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(
    name: string,
    email: string,
    verificationLink: string,
    verificationToken?: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('EMAIL_VERIFICATION', email, {
      name,
      verificationLink,
      verificationToken
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    name: string,
    email: string,
    resetLink: string,
    expiryHours: number = 1
  ): Promise<boolean> {
    return this.sendTemplateEmail('PASSWORD_RESET', email, {
      name,
      resetLink,
      expiryHours
    });
  }

  /**
   * Send welcome email after verification
   */
  async sendWelcomeEmail(
    name: string,
    email: string,
    dashboardLink: string,
    profileLink: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('WELCOME', email, {
      name,
      dashboardLink,
      profileLink
    });
  }

  /**
   * Send profile verification status email
   */
  async sendProfileVerifiedEmail(
    name: string,
    email: string,
    profileLink: string,
    forumLink: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('PROFILE_VERIFIED', email, {
      name,
      profileLink,
      forumLink
    });
  }

  /**
   * Send security alert email
   */
  async sendSecurityAlert(
    name: string,
    email: string,
    device: string,
    location: string,
    time: string,
    accountLink: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('SECURITY_ALERT', email, {
      name,
      device,
      location,
      time,
      accountLink
    });
  }

  /**
   * Send forum notification
   */
  async sendForumNotification(
    name: string,
    email: string,
    forumName: string,
    threadTitle: string,
    author: string,
    snippet: string,
    threadLink: string,
    unsubscribeLink: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('FORUM_NOTIFICATION', email, {
      name,
      forumName,
      threadTitle,
      author,
      snippet,
      threadLink,
      unsubscribeLink
    });
  }

  /**
   * Send event registration confirmation
   */
  async sendEventRegistration(
    name: string,
    email: string,
    eventTitle: string,
    eventDate: string,
    eventTime: string,
    eventLink: string,
    joinLink: string,
    addToCalendarLink?: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('EVENT_REGISTRATION', email, {
      name,
      eventTitle,
      eventDate,
      eventTime,
      eventLink,
      joinLink,
      addToCalendarLink
    });
  }

  /**
   * Notify admin of new user registration
   */
  async notifyAdminNewUser(
    adminEmail: string | string[],
    userName: string,
    userEmail: string,
    userRole: string,
    userStatus: string,
    adminLink: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('ADMIN_NEW_USER', adminEmail, {
      userName,
      userEmail,
      userRole,
      userStatus,
      adminLink,
      timestamp: new Date().toLocaleString()
    });
  }

  /**
   * Test email connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email server connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email server connection failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const emailService = new EmailService();