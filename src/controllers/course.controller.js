const prisma = require("../../utils/prisma_connection");
const Joi = require("joi");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const courseSchema = Joi.object({
  title: Joi.string().required(),
  photo: Joi.any().optional(),
});


const courseExists = async (title) => {
  return await prisma.course.findFirst({ where: { title } });
};

// Create Course
const createCourse = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { title } = req.body;
    const photo = req.files ? req.files.photo : null;
    const { error } = courseSchema.validate({ title, photo });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const findCourse = await courseExists(title);
    if (findCourse) {
      return res.status(400).json({ message: "Course already exists" });
    }

    let photoName;
    if (photo) {
      photoName = `${uuidv4()}.${photo.mimetype.split("/")[1]}`;
      const uploadPath = path.join(process.cwd(), "uploads", photoName);
      await photo.mv(uploadPath);
    }

    const course = await prisma.course.create({
      data: { title, photo: photoName },
    });

    return res
      .status(201)
      .json({ message: "Course created successfully", course });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Get All Courses
const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { lessons: true },
        },
        lessons: true, // Include lessons if needed
      },
    });

    const coursesWithLessonCount = courses.map((course) => ({
      ...course,
      lessonsCount: course._count.lessons,
    }));

    return res.status(200).json(coursesWithLessonCount);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Get Single Course
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: { lessons: true },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Update Course
const updateCourse = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { id } = req.params;
    const { title } = req.body;
    const photo = req.files ? req.files.photo : null;

    const { error } = courseSchema.validate({ title, photo });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let photoName;
    if (photo) {
      photoName = `${uuidv4()}.${photo.mimetype.split("/")[1]}`;
      const uploadPath = path.join(process.cwd(), "uploads", photoName);
      await photo.mv(uploadPath);
    }

    const courseData = { title, photo: photoName };

    const course = await prisma.course.update({
      where: { id },
      data: courseData,
    });

    return res
      .status(200)
      .json({ message: "Course updated successfully", course });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};


const deleteCourse = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
