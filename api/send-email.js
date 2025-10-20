const { Resend } = require('resend');

module.exports = async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'Missing required fields: name, email, and message are required'
            });
        }

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
            return res.status(400).json({ error: 'Failed to send email' });
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
            error: 'Internal server error'
        });
    }
};