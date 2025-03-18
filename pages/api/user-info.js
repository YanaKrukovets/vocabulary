import connectToDatabase from "../../lib/mongodb";
import User from "../../models/User";
import { verifyToken } from "../../lib/auth"; // Utility to verify JWT token

export default async function handler(req, res) {
  if (req.method === "POST") {
    // POST request logic (Add vocabulary)

    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token); // Token verification utility
      await connectToDatabase();

      // Retrieve the user from the database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Extract word and translation from the request body
      const { word, translation } = req.body;

      if (!word || !translation) {
        return res
          .status(400)
          .json({ error: "Both word and translation are required" });
      }

      // Add the new vocabulary to the user's vocabulary list
      if (user.vocabulary) user.vocabulary.push({ word, translation });
      else user.vocabulary = [];
      await user.save();

      // Return the updated vocabulary list
      return res.status(200).json({
        message: "Vocabulary added successfully",
        vocabulary: user.vocabulary,
      });
    } catch (error) {
      console.error("Error adding vocabulary:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else if (req.method === "GET") {
    // GET request logic (Fetch vocabulary)

    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token); // Token verification utility
      await connectToDatabase();

      // Retrieve the user from the database
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return the user's vocabulary list
      return res.status(200).json({
        vocabulary: user.vocabulary || [], // Send the vocabulary, or an empty array if none
      });
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
