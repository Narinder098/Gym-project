import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmails = async ({ name, email, message }) => {
  try {
    // Email to admin
    await transporter.sendMail({
      from: `"Gym App" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'narindersuthar16@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    // Confirmation email to user
    await transporter.sendMail({
      from: `"Gym App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Contacting Gym App',
      text: `Dear ${name},\n\nThank you for reaching out to us! We have received your message and will get back to you soon.\n\nYour Message:\n${message}\n\nBest regards,\nGym App Team`,
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We have received your message and will respond as soon as possible.</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <p>Best regards,<br>Gym App Team</p>
      `,
    });

    return { success: true, message: 'Emails sent successfully' };
  } catch (err) {
    console.error('Error sending emails:', err.message, err.stack);
    return { success: false, message: 'Failed to send emails' };
  }
};

export { sendContactEmails };