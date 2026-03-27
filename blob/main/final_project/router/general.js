const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Функция-заглушка для имитации асинхронного запроса (как если бы мы использовали Axios)
const getBooksAsync = () => Promise.resolve(books);

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
    try {
        const allBooks = await getBooksAsync();
        res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

// Task 11: Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const allBooks = await getBooksAsync();
        const book = allBooks[isbn];
        if (book) {
            res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching book details"});
    }
});

// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const allBooks = await getBooksAsync();
        const filteredBooks = Object.values(allBooks).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({message: "No books found for this author"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching books by author"});
    }
});

// Task 13: Get book details based on title using Async/Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const allBooks = await getBooksAsync();
        const filteredBooks = Object.values(allBooks).filter(b => b.title === title);
        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({message: "No books found with this title"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching books by title"});
    }
});

module.exports.general = public_users;
