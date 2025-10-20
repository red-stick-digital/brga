const { Resend } = require('resend');

module.exports = async function handler(req, res) {
    // Only allow POST requests
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
};