import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Email endpoint (matches /api/send-email.js serverless function)
app.post('/api/send-email', async (req, res) => {
    console.log('API endpoint hit:', req.body);

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            console.log('Validation failed - missing fields');
            return res.status(400).json({
                error: 'Missing required fields: name, email, and message are required'
            });
        }

        console.log('Attempting to send email with Resend...');

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Baton Rouge GA Website <contact@batonrougega.org>',
            to: ['batonrougega@gmail.com'],
            subject: `New Contact Form Submission from ${name}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p>You have received a new contact form submission from the Baton Rouge GA website.</p>
        
        <hr />
        
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br />')}
        </div>
        
        <hr />
        
        <p style="color: #666; font-size: 12px;">
          This message was sent via the contact form on batonrougega.org
        </p>
      `,
            // Also send a plain text version
            text: `
New Contact Form Submission

You have received a new contact form submission from the Baton Rouge GA website.

From: ${name}
Email: ${email}

Message:
${message}

---
This message was sent via the contact form on batonrougega.org
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(400).json({ error: 'Failed to send email', details: error });
        }

        console.log('Email sent successfully:', data);
        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            id: data.id
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Custom email endpoint (matches /api/send-custom-email.js serverless function)
app.post('/api/send-custom-email', async (req, res) => {
    console.log('Custom email endpoint hit:', req.body);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const {
            to,
            subject,
            html,
            text = null,
            from = null
        } = req.body;

        // Validate required fields
        if (!to || !subject || !html) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({
                error: 'Missing required fields: to, subject, and html are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            return res.status(400).json({
                error: 'Invalid email format for recipient'
            });
        }

        // Set default sender if not provided
        const defaultFrom = 'Baton Rouge GA <noreply@batonrougega.org>';
        const sender = from || defaultFrom;

        console.log('Attempting to send custom email with Resend...');

        // Prepare email data
        const emailData = {
            from: sender,
            to: [to],
            subject: subject,
            html: html,
        };

        // Add plain text version if provided
        if (text) {
            emailData.text = text;
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send(emailData);

        if (error) {
            console.error('Resend error:', error);
            return res.status(400).json({
                error: 'Failed to send email',
                details: error.message
            });
        }

        console.log('Custom email sent successfully:', {
            id: data.id,
            to: to,
            subject: subject
        });

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            id: data.id
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Speaker request endpoint (matches /api/send-speaker-request.js serverless function)
app.post('/api/send-speaker-request', async (req, res) => {
    console.log('Speaker request endpoint hit:', req.body);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const {
            organizationName,
            contactName,
            contactEmail,
            phoneNumber,
            requestedDate,
            alternateDate,
            eventType,
            audienceSize,
            location,
            address,
            additionalInfo
        } = req.body;

        // Validate required fields
        if (!organizationName || !contactName || !contactEmail || !requestedDate || !eventType || !location) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        console.log('Attempting to send speaker request email with Resend...');

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Baton Rouge GA Website <contact@batonrougega.org>',
            to: ['batonrougega@gmail.com'],
            subject: `New Speaker Request from ${organizationName}`,
            html: `
                <h2>New Speaker Request Submission</h2>
                <p>You have received a new speaker request from the Baton Rouge GA website.</p>
                
                <hr />
                
                <h3>Contact Information</h3>
                <p><strong>Organization:</strong> ${organizationName}</p>
                <p><strong>Contact Name:</strong> ${contactName}</p>
                <p><strong>Email:</strong> ${contactEmail}</p>
                ${phoneNumber ? `<p><strong>Phone:</strong> ${phoneNumber}</p>` : ''}
                
                <h3>Event Details</h3>
                <p><strong>Event Type:</strong> ${eventType}</p>
                <p><strong>Requested Date:</strong> ${requestedDate}</p>
                ${alternateDate ? `<p><strong>Alternate Date:</strong> ${alternateDate}</p>` : ''}
                <p><strong>Location:</strong> ${location}</p>
                ${address ? `<p><strong>Address:</strong> ${address}</p>` : ''}
                ${audienceSize ? `<p><strong>Expected Audience Size:</strong> ${audienceSize}</p>` : ''}
                
                ${additionalInfo ? `
                    <h3>Additional Information</h3>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
                        ${additionalInfo.replace(/\n/g, '<br />')}
                    </div>
                ` : ''}
                
                <hr />
                
                <p style="color: #666; font-size: 12px;">
                    This request was sent via the speaker request form on batonrougega.org
                </p>
            `,
            text: `
New Speaker Request Submission

Contact Information:
Organization: ${organizationName}
Contact Name: ${contactName}
Email: ${contactEmail}
${phoneNumber ? `Phone: ${phoneNumber}` : ''}

Event Details:
Event Type: ${eventType}
Requested Date: ${requestedDate}
${alternateDate ? `Alternate Date: ${alternateDate}` : ''}
Location: ${location}
${address ? `Address: ${address}` : ''}
${audienceSize ? `Expected Audience Size: ${audienceSize}` : ''}

${additionalInfo ? `Additional Information:\n${additionalInfo}` : ''}

---
This request was sent via the speaker request form on batonrougega.org
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(400).json({ error: 'Failed to send email', details: error });
        }

        console.log('Speaker request sent successfully:', data);
        return res.status(200).json({
            success: true,
            message: 'Speaker request sent successfully',
            id: data.id
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Development API server running on http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  - POST http://localhost:${PORT}/api/send-email`);
    console.log(`  - POST http://localhost:${PORT}/api/send-custom-email`);
    console.log(`  - POST http://localhost:${PORT}/api/send-speaker-request`);
});