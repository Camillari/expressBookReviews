const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username) return res.status(300).json({ message: 'please input a username' })
    if (!password) return res.status(300).json({ message: 'please input a password' })

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    const fetchBooks = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
            }, 1000); // Simulating a delay of 1 second
        });
    };
    fetchBooks()
        .then((books) => {
            res.send(JSON.stringify(books, null, 4));
        })
        .catch((error) => {
            console.error('Error fetching books:', error);
            res.status(500).send('Internal Server Error');
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const fetchBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = books[isbn];
                if (book) {
                    resolve(book);
                } else {
                    reject(new Error('Book not found'));
                }
            }, 1000);
        });
    };

    const isbn = req.params.isbn;
    fetchBookByISBN(isbn)
        .then((book) => {
            res.send(JSON.stringify(book, null, 4));
        })
        .catch((error) => {
            console.error('Error fetching book by ISBN:', error);
            res.status(404).send('Book not found');
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const fetchBooksByAuthor = (authorName) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const matchingBooks = Object.values(books).filter(book =>
                    book.author.replace(' ', '') === authorName.replace(' ', '').trim()
                );

                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject(new Error('Books with the specified author not found'));
                }
            }, 1000);
        });
    };

    const authorName = req.params.author

    fetchBooksByAuthor(authorName)
        .then((books) => {
            res.send(JSON.stringify(books, null, 4));
        })
        .catch((error) => {
            console.error('Error fetching books by author:', error);
            res.status(404).send('Books with the specified author not found');
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here

    const fetchBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const matchingBooks = Object.values(books).filter(book =>
                    book.title.replace(' ', '') === title.replace(' ', '').trim()
                );

                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject(new Error('Books with the specified title not found'));
                }
            }, 1000);
        });
    };

    const title = req.params.title

    fetchBooksByTitle(title)
        .then((books) => {
            res.send(JSON.stringify(books, null, 4));
        })
        .catch((error) => {
            console.error('Error fetching books by title:', error);
            res.status(404).send('Books with the specified title not found');
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]?.reviews)
});

module.exports.general = public_users;
