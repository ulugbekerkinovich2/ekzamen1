const { Router } = require("express");
const { login } = require("../controllers/authAdmin.controller");

const router = Router();

router.post("/login", login);

module.exports = router;