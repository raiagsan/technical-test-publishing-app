const express = require("express");
const router = express.Router();
const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const { authorValidator } = require("../validators/authorValidator");
const { authenticate } = require("../middlewares/auth");

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     tags: [Authors]
 *     summary: Get all authors (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: createdAt }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *     responses:
 *       200:
 *         description: List of authors with pagination
 */
router.get("/", getAuthors);
router.get("/:id", getAuthor);
router.post("/", authorValidator, createAuthor);
router.put("/:id", authorValidator, updateAuthor);
router.delete("/:id", deleteAuthor);

module.exports = router;
