const express = require("express");
const router = express.Router();
const booksController = require("../controllers/book-controller");
const usersController = require("../controllers/user-controller");
const historyController = require("../controllers/history-controller");

// Auth routes
router.post("/register", usersController.registerUser);
router.post("/login", usersController.login);
router.get("/auth", usersController.authenticate);
// router.get("/logout", usersController.logout);

// Book routes
router.get("/books", booksController.getAllBookRequests);
router.post("/books/new", booksController.requestBook);
router.get("/books/:id", booksController.getBookById);
router.put("/books/:id/update", booksController.updateBook);
router.put("/books/:id/updatestatus", booksController.updateBookStatus);
router.put("/books/:id/updatehandledby", booksController.updateBookHandledBy);

// BookHistory routes
router.get("/bookhistory/:id", historyController.getBookHistory);

// User routes
router.get("/users", usersController.getAllUsers);
router.delete("/users/:id", usersController.deleteUser);
router.post("/users/new", usersController.registerUser);

module.exports = router;
