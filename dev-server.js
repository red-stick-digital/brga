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

app.listen(PORT, () => {
    console.log(`Development API server running on http://localhost:${PORT}`);
    console.log(`Contact form will use: http://localhost:${PORT}/api/send-email`);
});