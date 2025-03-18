// pages/api/auth/register.js
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      await connectToDatabase();
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = new User({ name, email, password });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
