import nodemailer, { Transporter } from "nodemailer";
import { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const EmailModule = async (email: string, name: string,qrCodeUrl:string): Promise<void> => {
  
  try {
    const transporter: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    const fullurl="http://localhost:5001"+qrCodeUrl;
    console.log(fullurl)
    const mailOptions = {
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Ticket Information",
      html: `
        <p>Hi ${name},</p>
        <p>Your ticket has been confirmed! Please click the link below to view your ticket:</p>
       
       <img src="${fullurl}" alt="QR Code" />
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
