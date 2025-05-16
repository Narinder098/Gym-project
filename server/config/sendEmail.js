import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
    console.log('❌ Missing RESEND_API key in .env config file.');
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => { 
    try {
        const { data, error } = await resend.emails.send({
            from: 'practice <onboarding@resend.dev>',
            to: sendTo.trim(),
            subject: subject,
            html: html, 
        });

        if (error) {
            console.error("❌ Email sending failed:", error);
            return { error };
        }

        console.log("✅ Email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("❌ SendEmail Error:", error);
        return { error };
    }
};

export default sendEmail;
