const prisma = require("../../utils/prisma_connection");
const Joi = require("joi");


const userCoursesSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required(),
});


const createUserCourse = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { userId, courseId } = req.body;

    const { error } = userCoursesSchema.validate({ userId, courseId });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userCourse = await prisma.userCourses.create({
      data: { userId, courseId },
    });

    return res.status(201).json({ message: "UserCourse created successfully", userCourse });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


const getUserCourses = async (req, res) => {
  try {
    const userCourses = await prisma.userCourses.findMany({
      include: { user: true, course: true },
    });

    return res.status(200).json(userCourses);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


const getUserCourseById = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const userCourse = await prisma.userCourses.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { user: true, course: true },
    });

    if (!userCourse) {
      return res.status(404).json({ message: "UserCourse not found" });
    }

    return res.status(200).json(userCourse);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


const updateUserCourse = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { userId, courseId } = req.params;
    const { newUserId, newCourseId } = req.body;

    const { error } = userCoursesSchema.validate({ userId: newUserId, courseId: newCourseId });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userCourse = await prisma.userCourses.update({
      where: { userId_courseId: { userId, courseId } },
      data: { userId: newUserId, courseId: newCourseId },
    });

    return res.status(200).json({ message: "UserCourse updated successfully", userCourse });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


const deleteUserCourse = async (req, res) => {
  try {
    const {isAdmin} = req.user
    if(!isAdmin){
      return res.status(403).json({message: "Access denied: Admins only"})
    }
    const { userId, courseId } = req.params;
    await prisma.userCourses.delete({
      where: { userId_courseId: { userId, courseId } },
    });

    return res.status(200).json({ message: "UserCourse deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  createUserCourse,
  getUserCourses,
  getUserCourseById,
  updateUserCourse,
  deleteUserCourse,
};
