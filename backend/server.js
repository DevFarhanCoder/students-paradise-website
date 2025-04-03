require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

// ✅ Allow frontend domain
const corsOptions = {
    origin: "https://students-paradise-website.vercel.app",
    methods: "GET, POST, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
};
app.use(cors(corsOptions));

// ✅ Handle preflight requests (OPTIONS method)
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://students-paradise-website.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204);
});

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post("/send-email", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://students-paradise-website.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    const { name, phone, course } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL,
        subject: "New Student Inquiry - Student's Paradise",
        text: `You have a new inquiry from:\n\nName: ${name}\nPhone: ${phone}\nCourse: ${course}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
