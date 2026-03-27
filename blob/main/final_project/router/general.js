const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// --- Task 10: Get all books using Async/Await ---
public_users.get('/', async function (req, res) {
    try {
        const getAllBooks = () => Promise.resolve(books);
        const result = await getAllBooks();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

// --- Task 11: Get book by ISBN using Promises ---
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const findByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book with this ISBN not found");
        }
    });

    findByIsbn
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({message: err}));
});

// --- Task 12: Get books by Author using Async/Await ---
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = () => {
            return new Promise((resolve, reject) => {
                const filtered = Object.values(books).filter(b => b.author === author);
                if (filtered.length > 0) resolve(filtered);
                else reject("No books found for this author");
            });
        };
        const result = await getBooksByAuthor();
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({message: error});
    }
});

// --- Task 13: Get books by Title using Promises (С ИСПРАВЛЕНИЕМ ОШИБОК) ---
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const findByTitle = new Promise((resolve, reject) => {
        const filtered = Object.values(books).filter(b => b.title === title);
        if (filtered.length > 0) {
            resolve(filtered);
        } else {
            reject("No books found with this title"); // ТЕПЕРЬ ЕСТЬ ОБРАБОТКА ОШИБКИ
        }
    });

    findByTitle
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(404).json({message: err})); // Возвращаем 404, если не найдено
});

module.exports.general = public_users;
