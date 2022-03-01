const express = require("express");
const router = express.Router();
const Book = require("../model/Book");
const controller = require("../controllers/controller");

router.get("/", controller.getAllBooks);
router.post("/", controller.addBook);
router.get("/:id", controller.getById);
router.put("/:id", controller.updateBook);
router.delete("/:id", controller.deleteBook);

module.exports = router;