require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ✅ Proper CORS setup
app.use(cors({
    origin: "https://students-paradise-website.vercel.app", // Allow frontend access
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type",
    credentials: true,
}));

app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
    const { name, phone, course } = req.body;

    try {
        const response = await axios.post("https://api.resend.com/emails", {
            from: "farhangori89@gmail.com",  // You need a verified domain email
            to: process.env.RECEIVER_EMAIL,
            subject: "New Student Inquiry - Student's Paradise",
            text: `Name: ${name}\nPhone: ${phone}\nCourse: ${course}`,
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json({ message: "Email sent successfully!", data: response.data });
    } catch (error) {
        console.error("Resend Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to send email." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
