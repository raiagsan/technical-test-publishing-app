const express = require("express");
const router = express.Router();
const {
  getPublishers,
  getPublisher,
  createPublisher,
  updatePublisher,
  deletePublisher,
} = require("../controllers/publisherController");
const { publisherValidator } = require("../validators/publisherValidator");
const { authenticate } = require("../middlewares/auth");

router.use(authenticate);

router.get("/", getPublishers);
router.get("/:id", getPublisher);
router.post("/", publisherValidator, createPublisher);
router.put("/:id", publisherValidator, updatePublisher);
router.delete("/:id", deletePublisher);

module.exports = router;
