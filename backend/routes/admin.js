import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

import adminModel from "../models/adminModel.js";
import CourseModel from "../models/CourseModel.js";
import PurchaseModel from "../models/PurchaseModel.js";
import { adminauth } from "../middleware/adminauth.js";

const router = express.Router();

const authSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6)
});

const courseSchema = z.object({
  title: z.string().min(2),
  discription: z.string().min(5),
  price: z.coerce.number().nonnegative(),
  image_url: z.string().url().or(z.literal("")).optional()
});

router.post("/signup", async (req, res) => {
  try {
    const parsed = authSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { name = "Admin", email, password } = parsed.data;

    const existing = await adminModel.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    const admin = await adminModel.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Admin signup successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const parsed = authSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { email, password } = parsed.data;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      message: "Admin signin successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/course", adminauth, async (req, res) => {
  try {
    const parsed = courseSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid course data" });
    }

    const course = await CourseModel.create({
      ...parsed.data,
      creater_id: req.admin.id
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/remcourse", adminauth, async (req, res) => {
  try {
    const courseId = req.headers.courseid;

    if (!courseId) {
      return res.status(400).json({ message: "courseId header is required" });
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await PurchaseModel.deleteMany({ courses_id: courseId });
    await CourseModel.deleteOne({ _id: courseId });

    res.json({ message: "Course removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
