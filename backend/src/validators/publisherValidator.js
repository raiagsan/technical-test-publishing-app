const { body } = require("express-validator");

const publisherValidator = [
  body("name").trim().notEmpty().withMessage("Publisher name is required"),
  body("address").optional().trim(),
];

module.exports = { publisherValidator };
