require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ✅ Proper CORS setup
const corsOptions = {
    origin: "https://students-paradise-website.vercel.app", // Allow only your frontend
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type",
    credentials: true,
};
app.use(cors(corsOptions));

// ✅ Handle preflight requests for CORS
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://students-paradise-website.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204);
});

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
    },
});

app.post("/send-email", async (req, res) => {
    const { name, phone, course } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL, // Your email
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
