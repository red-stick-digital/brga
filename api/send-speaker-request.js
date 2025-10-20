import { Resend } from 'resend';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { name, email, phone, organizationName, eventDate } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !organizationName || !eventDate) {
            return res.status(400).json({
                error: 'Missing required fields: name, email, phone, organizationName, and eventDate are required'
            });
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Baton Rouge GA Website <contact@batonrougega.org>',
            to: ['batonrougega@gmail.com'],
            subject: `New Speaker Request from ${name}`,
            html: `
        <h2>New Speaker Request</h2>
        <p>You have received a new speaker request from the Baton Rouge GA website.</p>
        
        <hr />
        
        <p><strong>Requestor Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Organization:</strong> ${organizationName}</p>
        <p><strong>Event Date:</strong> ${eventDate}</p>
        
        <hr />
        
        <p style="color: #666; font-size: 12px;">
          This message was sent via the speaker request form on batonrougega.org
        </p>
      `,
            // Also send a plain text version
            text: `
New Speaker Request

You have received a new speaker request from the Baton Rouge GA website.

Requestor Name: ${name}
Email: ${email}
Phone: ${phone}
Organization: ${organizationName}
Event Date: ${eventDate}

---
This message was sent via the speaker request form on batonrougega.org
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(400).json({ error: 'Failed to send speaker request' });
        }

        console.log('Speaker request email sent successfully:', data);
        return res.status(200).json({
            success: true,
            message: 'Speaker request submitted successfully',
            id: data.id
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}