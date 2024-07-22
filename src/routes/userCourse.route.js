const express = require("express");
const router = express.Router();
const {
  createUserCourse,
  getUserCourses,
  getUserCourseById,
  updateUserCourse,
  deleteUserCourse,
} = require("../controllers/usersCourse.controller");
const isAdmin = require("../middleware/is-admin.middleware");

router.post("/", isAdmin, createUserCourse);
router.get("/", isAdmin, getUserCourses);
router.get("/:userId/:courseId", getUserCourseById);
router.put("/:userId/:courseId", isAdmin, updateUserCourse);
router.delete("/:userId/:courseId", isAdmin, deleteUserCourse);

module.exports = router;
