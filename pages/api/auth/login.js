// pages/api/auth/login.js
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      await connectToDatabase();
      const user = await User.findOne({ email });

      if (!user || !(await user.matchPassword(password))) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error); // Log the error for more details
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
