const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/authors", require("./authors"));
router.use("/publishers", require("./publishers"));
router.use("/books", require("./books"));

module.exports = router;
