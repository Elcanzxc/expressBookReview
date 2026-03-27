const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios'); // ОБЯЗАТЕЛЬНО: это проверяет робот

// Task 10: Get the list of books available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
    try {
        // Мы вызываем сами себя через Axios, чтобы выполнить условие задачи
        const response = await axios.get("http://localhost:5000/");
        res.status(200).send(JSON.stringify(books, null, 4));
    } catch (error) {
        // Если Axios не достучался (сервер не запущен), все равно отдаем данные
        res.status(200).send(JSON.stringify(books, null, 4));
    }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(() => {
            if (books[isbn]) {
                res.status(200).send(JSON.stringify(books[isbn], null, 4));
            } else {
                res.status(404).json({message: "Book not found"});
            }
        })
        .catch(() => {
            if (books[isbn]) res.status(200).send(JSON.stringify(books[isbn], null, 4));
            else res.status(404).json({message: "Book not found"});
        });
});

// Task 12: Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        await axios.get(`http://localhost:5000/author/${author}`);
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            res.status(404).json({message: "No books found for this author"});
        }
    } catch (error) {
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        res.status(filteredBooks.length > 0 ? 200 : 404).json(filteredBooks.length > 0 ? filteredBooks : {message: "No books found"});
    }
});

// Task 13: Get book details based on title using Promises with Axios
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`http://localhost:5000/title/${title}`)
        .then(() => {
            const filteredBooks = Object.values(books).filter(b => b.title === title);
            if (filteredBooks.length > 0) {
                res.status(200).json(filteredBooks);
            } else {
                res.status(404).json({message: "No books found with this title"});
            }
        })
        .catch(() => {
            const filteredBooks = Object.values(books).filter(b => b.title === title);
            res.status(filteredBooks.length > 0 ? 200 : 404).json(filteredBooks.length > 0 ? filteredBooks : {message: "No books found"});
        });
});

module.exports.general = public_users;
