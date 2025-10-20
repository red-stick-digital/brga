import supabase from './supabase.js';

/**
 * Email Service for Baton Rouge GA
 * Handles both authentication emails (via Supabase) and custom emails (via API)
 */
class EmailService {
    constructor() {
        this.apiBase = import.meta.env.DEV
            ? 'http://localhost:3000/api'
            : '/api';
    }

    /**
     * Send a custom email via Resend API
     * @param {Object} emailData - Email data object
     * @param {string} emailData.to - Recipient email
     * @param {string} emailData.subject - Email subject
     * @param {string} emailData.html - HTML content
     * @param {string} emailData.text - Plain text content (optional)
     * @param {string} emailData.from - Sender info (optional)
     */
    async sendCustomEmail({ to, subject, html, text = null, from = null }) {
        try {
            const response = await fetch(`${this.apiBase}/send-custom-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to,
                    subject,
                    html,
                    text,
                    from
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending custom email:', error);
            throw error;
        }
    }

    /**
     * Send contact form email (existing functionality)
     * @param {Object} formData - Contact form data
     */
    async sendContactForm({ name, email, message }) {
        try {
            const response = await fetch(`${this.apiBase}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending contact form:', error);
            throw error;
        }
    }

    /**
     * Send speaker request email
     * @param {Object} requestData - Speaker request data
     */
    async sendSpeakerRequest(requestData) {
        try {
            const response = await fetch(`${this.apiBase}/send-speaker-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending speaker request:', error);
            throw error;
        }
    }

    /**
     * Send welcome email to new members
     * @param {string} email - Member's email
     * @param {string} name - Member's name
     */
    async sendWelcomeEmail(email, name) {
        const subject = 'Welcome to Baton Rouge Gamblers Anonymous';
        const html = this.getWelcomeEmailTemplate(name);

        return await this.sendCustomEmail({
            to: email,
            subject,
            html
        });
    }

    /**
     * Send meeting reminder email
     * @param {string} email - Member's email
     * @param {string} name - Member's name
     * @param {Object} meetingInfo - Meeting details
     */
    async sendMeetingReminder(email, name, meetingInfo) {
        const subject = `Meeting Reminder: ${meetingInfo.title}`;
        const html = this.getMeetingReminderTemplate(name, meetingInfo);

        return await this.sendCustomEmail({
            to: email,
            subject,
            html
        });
    }

    /**
     * Send event announcement
     * @param {Array} recipients - Array of email addresses
     * @param {Object} eventData - Event details
     */
    async sendEventAnnouncement(recipients, eventData) {
        const subject = `Event Announcement: ${eventData.title}`;
        const html = this.getEventAnnouncementTemplate(eventData);

        // Send to all recipients (consider batching for large lists)
        const promises = recipients.map(email =>
            this.sendCustomEmail({
                to: email,
                subject,
                html
            })
        );

        return await Promise.allSettled(promises);
    }

    /**
     * Trigger Supabase authentication emails
     * These use Supabase's built-in email system with your configured templates
     */
    async sendPasswordReset(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error sending password reset:', error);
            throw error;
        }
    }

    async sendEmailConfirmation(email) {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error sending email confirmation:', error);
            throw error;
        }
    }

    // Email Templates
    getWelcomeEmailTemplate(name) {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Baton Rouge GA</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8BB7D1; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #6B92B0; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Baton Rouge GA</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Welcome to the Baton Rouge Gamblers Anonymous community! We're glad you've taken this important step in your recovery journey.</p>
              
              <h3>What's Next?</h3>
              <ul>
                <li>Attend your first meeting - check our <a href="https://batonrougega.org/meetings">meeting schedule</a></li>
                <li>Read about <a href="https://batonrougega.org/my-first-meeting">what to expect at your first meeting</a></li>
                <li>Learn about the <a href="https://batonrougega.org/twelve-steps">Twelve Steps and Unity Program</a></li>
                <li>Connect with other members through our directory</li>
              </ul>

              <p style="text-align: center; margin: 30px 0;">
                <a href="https://batonrougega.org/dashboard" class="button">Visit Your Dashboard</a>
              </p>

              <p>Remember: Recovery starts with a single step, and you've already taken it.</p>
              <p>If you have any questions, please don't hesitate to reach out to us.</p>
            </div>
            <div class="footer">
              <p>Baton Rouge Gamblers Anonymous<br>
              Recovery starts with a single step.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }

    getMeetingReminderTemplate(name, meetingInfo) {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Meeting Reminder</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8BB7D1; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
            .meeting-info { background-color: white; padding: 15px; border-left: 4px solid #6B92B0; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Meeting Reminder</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>This is a friendly reminder about the upcoming meeting:</p>
              
              <div class="meeting-info">
                <h3>${meetingInfo.title}</h3>
                <p><strong>Date:</strong> ${meetingInfo.date}</p>
                <p><strong>Time:</strong> ${meetingInfo.time}</p>
                <p><strong>Location:</strong> ${meetingInfo.location}</p>
                ${meetingInfo.description ? `<p><strong>Description:</strong> ${meetingInfo.description}</p>` : ''}
              </div>

              <p>We look forward to seeing you there. Remember, every meeting is an opportunity for growth and connection.</p>
            </div>
            <div class="footer">
              <p>Baton Rouge Gamblers Anonymous<br>
              Recovery starts with a single step.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }

    getEventAnnouncementTemplate(eventData) {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Event Announcement</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8BB7D1; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { background-color: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
            .event-info { background-color: white; padding: 15px; border-left: 4px solid #6B92B0; margin: 15px 0; }
            .button { display: inline-block; padding: 10px 20px; background-color: #6B92B0; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Special Event Announcement</h1>
            </div>
            <div class="content">
              <p>Dear GA Community,</p>
              <p>We're excited to announce an upcoming event for our community:</p>
              
              <div class="event-info">
                <h3>${eventData.title}</h3>
                <p><strong>Date:</strong> ${eventData.date}</p>
                <p><strong>Time:</strong> ${eventData.time}</p>
                <p><strong>Location:</strong> ${eventData.location}</p>
                <p><strong>Description:</strong> ${eventData.description}</p>
              </div>

              <p>This is a great opportunity to connect with fellow members and strengthen our community bonds.</p>

              <p style="text-align: center; margin: 30px 0;">
                <a href="https://batonrougega.org/events" class="button">View All Events</a>
              </p>

              <p>We hope to see you there!</p>
            </div>
            <div class="footer">
              <p>Baton Rouge Gamblers Anonymous<br>
              Recovery starts with a single step.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }
}

// Export a singleton instance
export default new EmailService();