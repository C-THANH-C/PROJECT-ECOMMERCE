import express from 'express';
import amqplib from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const amqp_url = 'amqp://admin:1234@localhost:5672';



const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc dịch vụ SMTP khác
    auth: {
        user: process.env.EMAIL_USER, // Email muốn sử dụng để gửi
        pass: process.env.EMAIL_PASS, // Mật khẩu email
    },
});
// Hàm gửi email xác thực
const sendVerificationEmail = async (email, otpCache) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            html: `<p>Please verify your email by OTP: ${otpCache}</p>`,
        };
        await transporter.sendMail(mailOptions);
        return { status: 'success', message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const listenQueue = async () => {
    try {
        // Kết nối tới RabbitMQ
        const connection = await amqplib.connect(amqp_url);
        const channel = await connection.createChannel();
        const queue = 'email_queue';
        await channel.assertQueue(queue, { durable: true });
        // Lắng nghe yêu cầu từ hàng đợi
        channel.consume(queue, async (msg) => {
            if (msg !== null && msg.fields.routingKey == "email_queue") {
                const { data } = await JSON.parse(msg.content.toString());
                const { email, otp } = await data
                console.log(email, otp);
                // Gọi hàm sendVerificationEmail để gửi email
                await sendVerificationEmail(email, otp);
                channel.sendToQueue(responseQueue, Buffer.from(responseMessage), {
                    correlationId,
                });
                channel.ack(msg); // Xác nhận đã xử lý thông điệp
            }
        });
    } catch (error) {
    }
};

listenQueue();

app.listen()