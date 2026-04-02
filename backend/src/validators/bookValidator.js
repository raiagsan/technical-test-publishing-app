const { body } = require("express-validator");

const bookValidator = [
  body("title").trim().notEmpty().withMessage("Book title is required"),
  body("isbn").optional().trim(),
  body("year")
    .optional()
    .isInt({ min: 1000, max: 9999 })
    .withMessage("Year must be a valid 4-digit number"),
  body("authorId").isInt({ min: 1 }).withMessage("Valid authorId is required"),
  body("publisherId")
    .isInt({ min: 1 })
    .withMessage("Valid publisherId is required"),
];

module.exports = { bookValidator };
