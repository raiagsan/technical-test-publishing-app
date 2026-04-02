const { body } = require("express-validator");

const authorValidator = [
  body("name").trim().notEmpty().withMessage("Author name is required"),
  body("bio").optional().trim(),
];

module.exports = { authorValidator };
