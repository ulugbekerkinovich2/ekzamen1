const { Router } = require("express");
const {
  createLesson,
  getLessons,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controller");
const isAuth = require("../middleware/is-auth.middleware");
const isAdmin = require("../middleware/is-admin.middleware");
const router = Router();

router.post("/", isAdmin, createLesson);
router.get("/", getLessons);
router.patch("/:id", isAdmin, updateLesson);
router.delete("/:id", isAdmin, deleteLesson);

module.exports = router;
