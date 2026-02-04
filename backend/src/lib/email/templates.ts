
// ACSP Brand Colors
const BRAND_COLORS = {
    NAVY_BLUE: '#0A1A4A',      // Primary brand color
    LIGHT_BLUE: '#2C3E8F',     // Secondary color
    WHITE: '#FFFFFF',
    LIGHT_GRAY: '#F5F7FA',
    DARK_GRAY: '#333333',
    SUCCESS: '#28a745',        // For success messages
    WARNING: '#ffc107',        // For warnings
    DANGER: '#dc3545',         // For errors/important notices
  };
  
  // Base template structure
  const getBaseTemplate = (content: string, title?: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title || 'ACSP - Association of Cybersecurity Practitioners'}</title>
      <style>
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
          
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              padding: 20px;
          }
          
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: ${BRAND_COLORS.WHITE};
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .email-header {
              background-color: ${BRAND_COLORS.NAVY_BLUE};
              color: ${BRAND_COLORS.WHITE};
              padding: 30px 20px;
              text-align: center;
          }
          
          .logo {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
              letter-spacing: 1px;
          }
          
          .logo-subtitle {
              font-size: 14px;
              opacity: 0.9;
              font-weight: 300;
          }
          
          .email-content {
              padding: 40px 30px;
          }
          
          .greeting {
              color: ${BRAND_COLORS.NAVY_BLUE};
              margin-bottom: 20px;
              font-size: 24px;
          }
          
          .message {
              margin-bottom: 25px;
              font-size: 16px;
              color: #555;
          }
          
          .cta-button {
              display: inline-block;
              background-color: ${BRAND_COLORS.NAVY_BLUE};
              color: ${BRAND_COLORS.WHITE};
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              transition: background-color 0.3s ease;
          }
          
          .cta-button:hover {
              background-color: ${BRAND_COLORS.LIGHT_BLUE};
          }
          
          .code-box {
              background-color: ${BRAND_COLORS.LIGHT_GRAY};
              border-left: 4px solid ${BRAND_COLORS.NAVY_BLUE};
              padding: 15px;
              margin: 20px 0;
              font-family: 'Courier New', monospace;
              font-size: 18px;
              text-align: center;
              letter-spacing: 2px;
              font-weight: bold;
          }
          
          .important-note {
              background-color: #fff8e1;
              border-left: 4px solid ${BRAND_COLORS.WARNING};
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
          }
          
          .info-box {
              background-color: #e8f4fd;
              border-left: 4px solid ${BRAND_COLORS.LIGHT_BLUE};
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
          }
          
          .link {
              color: ${BRAND_COLORS.LIGHT_BLUE};
              word-break: break-all;
              text-decoration: underline;
          }
          
          .email-footer {
              background-color: ${BRAND_COLORS.LIGHT_GRAY};
              padding: 25px 30px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e0e0e0;
          }
          
          .social-links {
              margin: 20px 0;
          }
          
          .social-links a {
              display: inline-block;
              margin: 0 10px;
              color: ${BRAND_COLORS.NAVY_BLUE};
              text-decoration: none;
              font-weight: 500;
          }
          
          .copyright {
              font-size: 12px;
              color: #888;
              margin-top: 20px;
          }
          
          @media (max-width: 600px) {
              .email-content {
                  padding: 25px 20px;
              }
              
              .cta-button {
                  display: block;
                  text-align: center;
                  margin: 25px 0;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">
              <div class="logo">ACSP</div>
              <div class="logo-subtitle">Association of Cybersecurity Practitioners</div>
          </div>
          
          <div class="email-content">
              ${content}
          </div>
          
          <div class="email-footer">
              <div class="social-links">
                  <a href="https://acsp.org">Website</a> | 
                  <a href="https://acsp.org/contact">Contact</a> | 
                  <a href="https://acsp.org/privacy">Privacy Policy</a>
              </div>
              <div class="copyright">
                  © ${new Date().getFullYear()} Association of Cybersecurity Practitioners. All rights reserved.<br>
                  This email was sent to you as part of your ACSP membership.
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
  
  // Template Definitions
  export const EmailTemplates = {
    // 1. EMAIL VERIFICATION
    EMAIL_VERIFICATION: {
      subject: 'Verify Your Email Address - ACSP',
      html: (data: {
        name: string;
        verificationLink: string;
        verificationToken?: string;
      }) => getBaseTemplate(`
        <h2 class="greeting">Welcome to ACSP, ${data.name}!</h2>
        
        <div class="message">
          <p>Thank you for registering with the Association of Cybersecurity Practitioners (ACSP).</p>
          <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${data.verificationLink}" class="cta-button">Verify Email Address</a>
        </div>
        
        <div class="message">
          <p>This link will expire in <strong>24 hours</strong>.</p>
          <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
          <a href="${data.verificationLink}" class="link">${data.verificationLink}</a>
        </div>
        
        <div class="info-box">
          <strong>Need help?</strong> If you didn't create an account with ACSP, please ignore this email or 
          <a href="mailto:support@acsp.org" style="color: ${BRAND_COLORS.NAVY_BLUE};">contact our support team</a>.
        </div>
      `, 'Verify Your Email - ACSP')
    },
  
    // 2. PASSWORD RESET
    PASSWORD_RESET: {
      subject: 'Reset Your ACSP Account Password',
      html: (data: {
        name: string;
        resetLink: string;
        resetToken?: string;
        expiryHours?: number;
      }) => getBaseTemplate(`
        <h2 class="greeting">Password Reset Request</h2>
        
        <div class="message">
          <p>Hello ${data.name},</p>
          <p>We received a request to reset your ACSP account password. Click the button below to set a new password:</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${data.resetLink}" class="cta-button">Reset Password</a>
        </div>
        
        <div class="message">
          <p>This password reset link will expire in <strong>${data.expiryHours || 1} hour${data.expiryHours !== 1 ? 's' : ''}</strong>.</p>
          <p>If you didn't request a password reset, please ignore this email or secure your account.</p>
        </div>
        
        <div class="important-note">
          <strong>Security Tip:</strong> Never share your password or this link with anyone. 
          ACSP will never ask for your password via email.
        </div>
      `, 'Reset Password - ACSP')
    },
  
    // 3. WELCOME EMAIL (after verification)
    WELCOME: {
      subject: 'Welcome to ACSP! Complete Your Profile',
      html: (data: {
        name: string;
        dashboardLink: string;
        profileLink: string;
      }) => getBaseTemplate(`
        <h2 class="greeting">Welcome to the ACSP Community, ${data.name}!</h2>
        
        <div class="message">
          <p>Congratulations! Your email has been verified successfully.</p>
          <p>You are now a member of the Association of Cybersecurity Practitioners. Here's what you can do next:</p>
        </div>
        
        <div style="margin: 30px 0;">
          <div style="margin-bottom: 20px;">
            <h3 style="color: ${BRAND_COLORS.NAVY_BLUE}; margin-bottom: 10px;">📝 Complete Your Profile</h3>
            <p>Share your expertise and connect with other cybersecurity professionals.</p>
            <a href="${data.profileLink}" class="cta-button" style="margin: 10px 0;">Complete Profile</a>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: ${BRAND_COLORS.NAVY_BLUE}; margin-bottom: 10px;">🏆 Explore Member Benefits</h3>
            <p>Access exclusive resources, forums, and networking opportunities.</p>
          </div>
          
          <div>
            <h3 style="color: ${BRAND_COLORS.NAVY_BLUE}; margin-bottom: 10px;">📚 Visit Your Dashboard</h3>
            <p>Manage your membership, access resources, and connect with peers.</p>
            <a href="${data.dashboardLink}" class="cta-button" style="margin: 10px 0;">Go to Dashboard</a>
          </div>
        </div>
        
        <div class="info-box">
          <strong>Need Assistance?</strong> Our community team is here to help. 
          <a href="mailto:community@acsp.org" style="color: ${BRAND_COLORS.NAVY_BLUE};">Contact us</a> for any questions.
        </div>
      `, 'Welcome to ACSP!')
    },
  
    // 4. PROFILE VERIFICATION STATUS
    PROFILE_VERIFIED: {
      subject: 'Your ACSP Profile Has Been Verified!',
      html: (data: {
        name: string;
        profileLink: string;
        forumLink: string;
      }) => getBaseTemplate(`
        <h2 class="greeting">Profile Verification Complete!</h2>
        
        <div class="message">
          <p>Hello ${data.name},</p>
          <p>Great news! Your ACSP profile has been successfully verified by our team.</p>
          <p>You now have full access to all member benefits and features.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: ${BRAND_COLORS.SUCCESS}; color: white; padding: 15px; border-radius: 6px; display: inline-block;">
            <strong style="font-size: 18px;">🎉 VERIFIED MEMBER</strong>
          </div>
        </div>
        
        <div class="message">
          <p><strong>What's next?</strong></p>
          <ul style="margin: 15px 0 15px 20px;">
            <li>Connect with other verified cybersecurity professionals</li>
            <li>Participate in exclusive member-only discussions</li>
            <li>Access premium resources and training materials</li>
            <li>Join upcoming events and webinars</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.forumLink}" class="cta-button">Join Community Discussions</a>
        </div>
        
        <div class="info-box">
          <strong>Share Your Achievement!</strong> Let your network know you're now a verified member of ACSP.
        </div>
      `, 'Profile Verified - ACSP')
    },
  
    // 5. ACCOUNT SECURITY ALERT
    SECURITY_ALERT: {
      subject: 'Security Alert: New Login Detected - ACSP',
      html: (data: {
        name: string;
        device: string;
        location: string;
        time: string;
        accountLink: string;
      }) => getBaseTemplate(`
        <h2 class="greeting">Security Alert</h2>
        
        <div class="message">
          <p>Hello ${data.name},</p>
          <p>We detected a new login to your ACSP account:</p>
        </div>
        
        <div style="background-color: ${BRAND_COLORS.LIGHT_GRAY}; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0;"><strong>Device:</strong></td>
              <td style="padding: 8px 0;">${data.device}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Location:</strong></td>
              <td style="padding: 8px 0;">${data.location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Time:</strong></td>
              <td style="padding: 8px 0;">${data.time}</td>
            </tr>
          </table>
        </div>
        
        <div class="important-note">
          <p><strong>If this was you:</strong> No action is required.</p>
          <p><strong>If this wasn't you:</strong> Your account may have been compromised. Please:</p>
          <ol style="margin: 10px 0 10px 20px;">
            <li>Change your password immediately</li>
            <li>Enable two-factor authentication</li>
            <li>Review your account activity</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.accountLink}" class="cta-button">Review Account Activity</a>
        </div>
      `, 'Security Alert - ACSP')
    },
  
    // 6. FORUM NOTIFICATION
    FORUM_NOTIFICATION: {
      subject: 'New Activity in ACSP Forum',
      html: (data: {
        name: string;
        forumName: string;
        threadTitle: string;
        author: string;
        snippet: string;
        threadLink: string;
        unsubscribeLink: string;
      }) => getBaseTemplate(`
        <h2 class="greeting">New Forum Activity</h2>
        
        <div class="message">
          <p>Hello ${data.name},</p>
          <p>There's new activity in the <strong>${data.forumName}</strong> forum that might interest you:</p>
        </div>
        
        <div style="border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <h3 style="color: ${BRAND_COLORS.NAVY_BLUE}; margin-bottom: 10px;">${data.threadTitle}</h3>
          <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Posted by: ${data.author}</p>
          <p>${data.snippet}...</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.threadLink}" class="cta-button">View Discussion</a>
        </div>
        
        <div style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
          <p>You're receiving this because you're subscribed to updates from this forum.</p>
          <p>
            <a href="${data.unsubscribeLink}" style="color: ${BRAND_COLORS.LIGHT_BLUE};">Unsubscribe from these notifications</a>
          </p>
        </div>
      `, 'Forum Notification - ACSP')
    },
  
    // 7. EVENT REGISTRATION CONFIRMATION
    EVENT_REGISTRATION: {
      subject: 'Event Registration Confirmed - ACSP',
      html: (data: {
        name: string;
        eventTitle: string;
        eventDate: string;
        eventTime: string;
        eventLink: string;
        joinLink: string;
        addToCalendarLink?: string;
      }) => getBaseTemplate(`
        <h2 class="greeting">Event Registration Confirmed!</h2>
        
        <div class="message">
          <p>Hello ${data.name},</p>
          <p>Thank you for registering for our upcoming event. Here are your registration details:</p>
        </div>
        
        <div style="background-color: ${BRAND_COLORS.LIGHT_GRAY}; padding: 25px; border-radius: 6px; margin: 25px 0;">
          <h3 style="color: ${BRAND_COLORS.NAVY_BLUE}; margin-bottom: 15px;">${data.eventTitle}</h3>
          
          <table style="width: 100%;">
            <tr>
              <td style="padding: 10px 0; width: 100px;"><strong>Date:</strong></td>
              <td style="padding: 10px 0;">${data.eventDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0;"><strong>Time:</strong></td>
              <td style="padding: 10px 0;">${data.eventTime}</td>
            </tr>
          </table>
          
          ${data.addToCalendarLink ? `
            <div style="margin-top: 15px;">
              <a href="${data.addToCalendarLink}" style="color: ${BRAND_COLORS.NAVY_BLUE}; text-decoration: none; font-size: 14px;">
                📅 Add to Calendar
              </a>
            </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.eventLink}" class="cta-button" style="margin-right: 10px;">Event Details</a>
          <a href="${data.joinLink}" class="cta-button" style="background-color: ${BRAND_COLORS.SUCCESS};">Join Event</a>
        </div>
        
        <div class="info-box">
          <strong>Reminder:</strong> This link will become active 15 minutes before the event starts.
        </div>
      `, 'Event Registration - ACSP')
    },
  
    // 8. ADMIN NOTIFICATION (for new user registration)
    ADMIN_NEW_USER: {
      subject: 'New User Registration - ACSP Admin',
      html: (data: {
        userName: string;
        userEmail: string;
        userRole: string;
        userStatus: string;
        adminLink: string;
        timestamp: string;
      }) => getBaseTemplate(`
        <h2 class="greeting">New User Registration</h2>
        
        <div class="message">
          <p>A new user has registered on the ACSP platform:</p>
        </div>
        
        <div style="background-color: ${BRAND_COLORS.LIGHT_GRAY}; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0; width: 120px;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${data.userName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;">${data.userEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Role:</strong></td>
              <td style="padding: 8px 0;">${data.userRole}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Status:</strong></td>
              <td style="padding: 8px 0;">${data.userStatus}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Registered:</strong></td>
              <td style="padding: 8px 0;">${data.timestamp}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.adminLink}" class="cta-button">Review User in Admin Panel</a>
        </div>
      `, 'New User Registration - ACSP Admin')
    }
  };