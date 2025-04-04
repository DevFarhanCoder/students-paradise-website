require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

// ✅ Allow frontend domain and Vercel preview deployments
const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://students-paradise-website.vercel.app",
        "https://*.vercel.app"
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: "GET,POST,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.enable('trust proxy');
app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin');
  next();
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', req.headers);
    next();
});

app.options("*", cors(corsOptions)); // Handle preflight requests
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
        console.error("Email sending failed:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
});

// ✅ Export app instead of listening (required by Vercel)
module.exports = app;
