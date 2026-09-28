import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

import UserModel from "../models/UserModel.js";
import CourseModel from "../models/CourseModel.js";
import PurchaseModel from "../models/PurchaseModel.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post("/signup", async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { name, email, password } = parsed.data;

    const existing = await UserModel.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const parsed = signinSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { email, password } = parsed.data;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      message: "Signin successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/purchase", auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await PurchaseModel.findOne({
      user_id: req.user.id,
      courses_id: courseId
    });

    if (existing) {
      return res.status(409).json({ message: "Course already purchased" });
    }

    const purchase = await PurchaseModel.create({
      user_id: req.user.id,
      courses_id: courseId
    });

    res.status(201).json({
      message: "Course purchased successfully",
      purchase
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/purchases", auth, async (req, res) => {
  try {
    const purchases = await PurchaseModel.find({
      user_id: req.user.id
    });

    const courseIds = purchases.map((purchase) => purchase.courses_id);
    const courses = await CourseModel.find({ _id: { $in: courseIds } });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
