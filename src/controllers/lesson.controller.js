const prisma = require("../../utils/prisma_connection");
const Joi = require("joi");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const lessonSchema = Joi.object({
  title: Joi.string().required(),
  courseId: Joi.string().required(),
});

const createLesson = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { title, courseId } = req.body;

    const { error } = lessonSchema.validate({ title, courseId });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const video = req.files.video;
    const videoName = `${uuidv4()}.${video.mimetype.split("/")[1]}`;
    const uploadPath = path.join(process.cwd(), "uploads", videoName);

    // Move the uploaded file to the uploads directory
    await video.mv(uploadPath);

    const lesson = await prisma.lessons.create({
      data: { title, video: videoName, courseId },
    });

    return res
      .status(201)
      .json({ message: "Lesson created successfully", lesson });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Get All Lessons
const getLessons = async (req, res) => {
  try {
    const lessons = await prisma.lessons.findMany({
      include: { course: true },
    });

    return res.status(200).json(lessons);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Get Single Lesson
const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await prisma.lessons.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.status(200).json(lesson);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Update Lesson
const updateLesson = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { id } = req.params;
    const { title, courseId } = req.body;

    const { error } = lessonSchema.validate({ title, courseId });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const lessonData = { title, courseId };

    if (req.files && req.files.video) {
      const video = req.files.video;
      const videoName = `${uuidv4()}.${video.mimetype.split("/")[1]}`;
      const uploadPath = path.join(process.cwd(), "uploads", videoName);

      // Move the uploaded file to the uploads directory
      await video.mv(uploadPath);

      lessonData.video = videoName;
    }

    const lesson = await prisma.lessons.update({
      where: { id },
      data: lessonData,
    });

    return res
      .status(200)
      .json({ message: "Lesson updated successfully", lesson });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Delete Lesson
const deleteLesson = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { id } = req.params;
    await prisma.lessons.delete({ where: { id } });

    return res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};
