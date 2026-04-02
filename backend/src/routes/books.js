const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { bookValidator } = require("../validators/bookValidator");
const { authenticate } = require("../middlewares/auth");

router.use(authenticate);

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", bookValidator, createBook);
router.put("/:id", bookValidator, updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
