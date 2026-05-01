import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { sub: String(user._id), email: user.email },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
  });
}
