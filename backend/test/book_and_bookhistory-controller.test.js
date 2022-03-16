const basicSetup = require('./helpers/basicSetup')
const booksController = require("../controllers/book-controller");
const bookhistoryController = require("../controllers/bookhistory-controller");
const mocks = require('node-mocks-http');
const Book = require("../models/Book");
const BookHistory = require("../models/BookHistory");

basicSetup();

// A global variable that is used to keep record of the new book that we requested
let bookid;

describe('booksController.requestBook() tests', () => {
  jest.setTimeout(10000);
  test('Sending details for new book without being logged in. Expect statusCode toBe 400', async () => {
    const req = {
      body: {
        name: 'book name dummy',
        author: "author name dummy",
        description: "dummy description",
        price: 100
      }
    };
    const res = mocks.createResponse();
    await booksController.requestBook(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Trying to request a new book being logged-in as an admin. Expect statusCode toBe 400', async () => {
    const req = {
      body: {
        name: 'book name dummy',
        author: "author name dummy",
        description: "dummy description",
        price: 100
      },
      cookies: {username : "dummyuser", usertype: "admin"}
    };
    const res = mocks.createResponse();
    await booksController.requestBook(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Trying to request a new book being logged-in as an employee. Expect statusCode toBe 400', async () => {
    const req = {
      body: {
        name: 'book name dummy',
        author: "author name dummy",
        description: "dummy description",
        price: 100
      },
      cookies: {username : "dummyuser", usertype: "employee"}
    };
    const res = mocks.createResponse();
    await booksController.requestBook(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Sending details for new book with a dummy username and then also checking that an entry in the book history table for it is also created. Expect statusCode toBe 200', async () => {
    const req = {
      body: {
        name: 'book name dummy',
        author: "author name dummy",
        description: "dummy description",
        price: 100
      },
      cookies: {username : "dummyuser", usertype: "user"}
    };
    const res = mocks.createResponse();
    await booksController.requestBook(req, res);
    expect(res.statusCode).toBe(200);

    bookid = (await BookHistory.findOne({username: "dummyuser"})).bookid

    const req2 = {
      params: {id: bookid},
      cookies: {username : "dummyuser", usertype: "user"}
    };
    const res2 = mocks.createResponse();
    await bookhistoryController.getBookHistory(req2, res2);
    expect(res2.statusCode).toBe(200);
  });
});

describe('booksController.getAllBookRequests() tests', () => {
  test('Trying to get the book details of all the books that belongs to this user. Expect statusCode toBe 200', async () => {
    const req = {
      cookies: {username : "dummyuser", usertype: "user"}
    };
    const res = mocks.createResponse();
    await booksController.getAllBookRequests(req, res);
    expect(res.statusCode).toBe(200);
  });

  test('Trying to get the book details of all the books for admin. Expect statusCode toBe 200', async () => {
    const req = {
      cookies: {username : "dummyuser", usertype: "admin"}
    };
    const res = mocks.createResponse();
    await booksController.getAllBookRequests(req, res);
    expect(res.statusCode).toBe(200);
  });

  test('Trying to get the book details of all the books for employee. Expect statusCode toBe 200', async () => {
    const req = {
      cookies: {username : "dummyuser", usertype: "employee"}
    };
    const res = mocks.createResponse();
    await booksController.getAllBookRequests(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe('booksController.getBookById() tests', () => {
  test('Trying to get the book details of a book for admin irrespective of username. Expect statusCode toBe 200', async () => {
    const req = {
      params: {id: bookid},
      cookies: {username : "dummyuser1", usertype: "admin"}
    };
    const res = mocks.createResponse();
    await booksController.getBookById(req, res);
    expect(res.statusCode).toBe(200);
  });

  test('Trying to get the book details of a book for employee irrespective of username. Expect statusCode toBe 200', async () => {
    const req = {
      params: {id: bookid},
      cookies: {username : "dummyuser1", usertype: "employee"}
    };
    const res = mocks.createResponse();
    await booksController.getBookById(req, res);
    expect(res.statusCode).toBe(200);
  });

  test('Trying to get the book details of a book that belongs to this user. Expect statusCode toBe 200', async () => {
    const req = {
      params: {id: bookid},
      cookies: {username : "dummyuser", usertype: "user"}
    };
    const res = mocks.createResponse();
    await booksController.getBookById(req, res);
    expect(res.statusCode).toBe(200);
  });

  test('Trying to get the book details of a book that doesn\'t to this user. Expect statusCode toBe 400', async () => {
    const req = {
      params: {id: bookid},
      cookies: {username : "dummyuser1", usertype: "user"}
    };
    const res = mocks.createResponse();
    await booksController.getBookById(req, res);
    expect(res.statusCode).toBe(400);
  });
});

describe('booksController.updateBook() tests', () => {
  jest.setTimeout(10000);
  test('Sending details for updating the book that doesn\'t belong to this particular user. Expect statusCode toBe 400', async () => {
    const req = {
      body: {
        name: 'book name updated',
        author: "author name updated",
        description: "description updated",
        price: 102
      },
      cookies: {username : "dummyuser1", usertype: "user"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBook(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Try updating the book as an admin. Expect statusCode toBe 400', async () => {
    const req = {
      body: {
        name: 'book name updated',
        author: "author name updated",
        description: "description updated",
        price: 102
      },
      cookies: {username : "dummyuser", usertype: "admin"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBook(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Try updating the book as an employee. Expect statusCode toBe 400', async () => {
    const req = {
      body: {
        name: 'book name updated',
        author: "author name updated",
        description: "description updated",
        price: 102
      },
      cookies: {username : "dummyuser", usertype: "employee"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBook(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Trying to update the book with legitimate user and then also checking that an entry in the book history table for it is also created. Expect statusCode toBe 200', async () => {
    const req = {
      body: {
        name: 'book name updated',
        author: "author name updated",
        description: "description updated",
        price: 102
      },
      cookies: {username : "dummyuser", usertype: "user"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBook(req, res);
    expect(res.statusCode).toBe(200);

    // Chacking that the attribute bookstate_int was updated to 3 automatically.
    const bookstate_int = (await Book.findById(bookid)).bookstate_int;
    expect(bookstate_int).toBe(3);

    // Checking that an entry in bookhistory table was made
    const req2 = {
      params: {id: bookid},
      cookies: {username : "dummyuser", usertype: "user"}
    };
    const res2 = mocks.createResponse();
    await bookhistoryController.getBookHistory(req2, res2);
    expect(res2.statusCode).toBe(200);
  });
});

describe('booksController.updateBookStatus() tests', () => {
  test('Try updating book status as a user that doesn\'t belong to this particular user. Expect statusCode toBe 400', async () => {
    const req = {
      body: {
        bookstate: 'Updating book status',
        bookstate_int: 4,
      },
      cookies: {username : "dummyuser1", usertype: "user"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBookStatus(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Try updating book status as an employee that doesn\'t handle this book request. Expect statusCode toBe 400', async () => {
    const req = {
      body: {
        bookstate: 'Ask more book info',
        bookstate_int: 2,
      },
      cookies: {username : "dummyuser1", usertype: "employee"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBookStatus(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Try updating the book status as legitimate user. Expect statusCode toBe 200', async () => {
    const req = {
      body: {
        bookstate: 'Book request cancelled',
        bookstate_int: 8,
      },
      cookies: {username : "dummyuser", usertype: "user"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBookStatus(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe('booksController.updateBookHandledBy() tests', () => {
  test('Try updating book handledby status as a user. Expect statusCode toBe 400', async () => {
    const req = {
      cookies: {username : "dummyuser", usertype: "user"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBookHandledBy(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('Try updating book handledby status as an employee. Expect statusCode toBe 200', async () => {
    const req = {
      cookies: {username : "employee1", usertype: "employee"},
      params: {id: bookid},
    };
    const res = mocks.createResponse();
    await booksController.updateBookHandledBy(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe('Cleanup after tests', () => {
  test('Book and BookHistory table cleanup', async () => {
    await Book.findByIdAndRemove(bookid);
    await BookHistory.deleteMany({bookid});
    expect(1).toBe(1);
  });
});
