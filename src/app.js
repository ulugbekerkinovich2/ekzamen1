const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const authRoute = require("./routes/auth.route");
const authAdminRoute = require("./routes/admin.route");
const courseRoute = require("./routes/course.route");
const lessonRoute = require("./routes/lesson.route");
const userCoursesRoute = require("./routes/userCourse.route");
const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static("uploads"));

app.use("/auth", authRoute);
app.use("/admin", authAdminRoute);
app.use("/course", courseRoute);
app.use("/lesson", lessonRoute);
app.use("/user-courses", userCoursesRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
