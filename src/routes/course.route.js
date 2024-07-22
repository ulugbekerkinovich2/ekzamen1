const { Router } = require("express");
const {
  getCourseById,
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

const isAdmin = require("../middleware/is-admin.middleware");
const router = Router();

router.post("/", isAdmin, createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.patch("/:id", isAdmin, updateCourse);
router.delete("/:id", isAdmin, deleteCourse);

module.exports = router;
