const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      phone: '1234567890',
      password: 'securepassword1',
      isAdmin: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      phone: '0987654321',
      password: 'securepassword2',
      isAdmin: false,
    },
  });

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Course 1',
      photo: 'course1.jpg',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Course 2',
      photo: 'course2.jpg',
    },
  });

  // Create Lessons
  const lesson1 = await prisma.lessons.create({
    data: {
      title: 'Lesson 1',
      video: 'lesson1.mp4',
      courseId: course1.id,
    },
  });

  const lesson2 = await prisma.lessons.create({
    data: {
      title: 'Lesson 2',
      video: 'lesson2.mp4',
      courseId: course1.id,
    },
  });

  const lesson3 = await prisma.lessons.create({
    data: {
      title: 'Lesson 3',
      video: 'lesson3.mp4',
      courseId: course2.id,
    },
  });

  // Create UserCourses
  const userCourse1 = await prisma.userCourses.create({
    data: {
      userId: user1.id,
      courseId: course1.id,
    },
  });

  const userCourse2 = await prisma.userCourses.create({
    data: {
      userId: user1.id,
      courseId: course2.id,
    },
  });

  const userCourse3 = await prisma.userCourses.create({
    data: {
      userId: user2.id,
      courseId: course2.id,
    },
  });

  console.log('Data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
