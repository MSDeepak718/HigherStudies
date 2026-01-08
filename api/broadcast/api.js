import { Router } from 'express';
import nodemailer from 'nodemailer';
import DataModel from '../data/model.js';

const router = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

router.post('/broadcast', async (req, res) => {
    try {
        const { subject, message, recipients } = req.body;

        if (!subject || !message || !recipients || recipients.length === 0) {
            return res.status(400).json({ 
                error: 'Subject, message, and recipients are required' 
            });
        }

        const emailList = recipients.map(r => r.emailid).filter(email => email);

        if (emailList.length === 0) {
            return res.status(400).json({ 
                error: 'No valid email addresses found in recipients' 
            });
        }

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: emailList.join(','),
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px;">
                        <h2 style="color: #333;">Message from Higher Studies Portal</h2>
                        <p style="color: #666; white-space: pre-wrap; line-height: 1.6;">${message}</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px;">
                            This is an automated message from the Higher Studies Cell. 
                            Please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            message: `Broadcast email sent successfully to ${emailList.length} recipients`,
            result: {
                recipientCount: emailList.length,
                messageId: result.messageId
            }
        });

    } catch (error) {
        console.error('Error sending broadcast email:', error);
        res.status(500).json({ 
            error: 'Failed to send broadcast email',
            details: error.message 
        });
    }
});

router.get('/broadcast/emails', async (req, res) => {
    try {
        const students = await DataModel.find({}, 'emailid studentname');
        const validEmails = students.filter(s => s.emailid && s.emailid.includes('@'));
        res.json({
            total: students.length,
            validEmails: validEmails.length,
            emails: validEmails
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
    }
});

export default router;
