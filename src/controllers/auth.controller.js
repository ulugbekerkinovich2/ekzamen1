const prisma = require("../../utils/prisma_connection");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { createToken } = require("../../utils/jwt");

const userSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

const validateInput = (schema, data) => {
  const { error } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const register = async (req, res) => {
  try {
    const { phone, password } = req.body;
    validateInput(userSchema, { phone, password });

    const existingUser = await prisma.user.findFirst({
      where: { phone },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { phone, password: hashedPassword },
    });

    return res.status(200).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    validateInput(userSchema, { phone, password });

    const user = await prisma.user.findFirst({
      where: { phone },
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken({ id: user.id, isAdmin: user.isAdmin });
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = { register, login };
