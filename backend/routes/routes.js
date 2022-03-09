const express = require("express");
const router = express.Router();
const booksController = require("../controllers/book-controller");
const usersController = require("../controllers/user-controller");
const historyController = require("../controllers/history-controller");

// Book routes
router.get("/", booksController.getAllBookRequests);
router.post("/", booksController.requestBook);
router.put("/update/:id", booksController.updateBook);
// router.get("/:id", booksController.getById);
router.put("/updatestatus/:id", booksController.updateBookStatus);
router.put("/updatehandledby/:id", booksController.updateBookHandledBy);
// router.delete("/:id", booksController.deleteBook);

// BookHistory routes
router.get("/bookhistory/:id", historyController.getBookHistory);

// User routes
router.post("/register", usersController.registerUser);
router.post("/login", usersController.login);
router.get("/users", usersController.getAllUsers);
router.delete("/users/:id", usersController.deleteUser);
router.post("/addemployee", usersController.registerUser);
// router.get("/auth", usersController.authenticate);
// router.get("/logout", usersController.logout);


module.exports = router;