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
    console.log(user.isAdmin);
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
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

module.exports = { login };
