const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body; 
  if(username && password) {
    if (users.find(user => user.username === username)) {
      return res.status(404).json({ message: "Username already exists" });
    }
    users.push({username: username, password: password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  } else {
    return res.status(404).json({ message: "Error logging in" });
  }
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.status(200).json(books);
// });

public_users.get('/', async (req, res) => {
  try {
    const booksFromPromise = await new Promise((resolve, reject) => {
      resolve(books)
    })
    return res.status(200).json(booksFromPromise);
  } catch(error) {
    return res.status(404).json({
      message: error.message,
      error: "Failed to get books"
    });
  }
})

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   return res.status(200).json(books[req.params.isbn]);
//  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const bookFromPromise = await new Promise((resolve, reject) => {
      const book = books[req.params.isbn];
      if (book) resolve(books[req.params.isbn]);
      else reject(new Error("book not found"))
    });
    return res.status(200).json(bookFromPromise);
  } catch(error) {
    return res.status(404).json({
      message: error.message,
      error: "Failed to retrieve books by isbn"
    });
  }
})

// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const booksList = Object.values(books).filter(item => item.author === req.params.author);
//   if(booksList.length === 0)  res.status(404).json({message: "no books by the author"})
//   return res.status(200).json(booksList);
// });

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try {
    const bookFromPromise = await new Promise((resolve, reject) => {
      const booksList = Object.values(books).filter(item => item.author === req.params.author);
      if(booksList.length === 0)  reject(new Error("no books by the author"))
      resolve(booksList);
    })
    return res.status(200).json(bookFromPromise);
  } catch(error) {
    return res.status(404).json({
      message: error.message,
      error: "Failed to retrieve books by author"
    });
  }
})

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const book = Object.values(books).filter(item => item.title === req.params.title);
//   if(book.length > 0)  return res.status(200).json(book);
//   return res.status(404).json({message: "book not found"});
// });

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const booksFromPromise = await new Promise((resolve, reject) => {
      const book = Object.values(books).filter(item => item.title === req.params.title);
      if(book.length > 0)  resolve(book);
      return reject(new Error("book not found"));
    });
    return res.status(200).json(booksFromPromise);
  } catch(error) {
      return res.status(404).json({
        message: error.message,
        error: "Failed to retrieve books by title"
      });
  }
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookReview = books[req.params.isbn].reviews;
  return res.status(200).json(bookReview);
});

module.exports.general = public_users;
