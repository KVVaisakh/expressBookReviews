const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
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
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.status(200).json(books[req.params.isbn]);
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const book = Object.values(books).filter(item => item.author === req.params.author);
  return res.status(200).json(book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const book = Object.values(books).find(item => item.title === req.params.title);
  return res.status(300).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookReview = books[req.params.isbn].reviews;
  return res.status(300).json(bookReview);
});

module.exports.general = public_users;
