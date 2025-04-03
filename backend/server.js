require("dotenv").config({ path: "../.env" });
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ✅ Proper CORS setup
app.use(cors({
    origin: "https://students-paradise-website.vercel.app", // Allow your frontend
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type",
    credentials: true,
}));

// ✅ Handle preflight requests (OPTIONS)
app.options("/send-email", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://students-paradise-website.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.status(204).end();
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
        console.error(error);
        res.status(500).json({ message: "Failed to send email." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
