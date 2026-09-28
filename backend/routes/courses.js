import express from "express";
import CourseModel from "../models/CourseModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const courses = await CourseModel.find({}).sort({ createdAt: -1 });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
