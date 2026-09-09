const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return users.find(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
  if(!isValid(username)) return false;
  const validUsers = users.filter(user => user.username === username && user.password === password)
  if(validUsers>0)  return false;
  return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if(!username || !password)  return res.status(404).json({message: "credentials missing"});
  if (!authenticatedUser(username, password))
    return res.status(404).json("invalid user or wrong password")
  const accessToken = jwt.sign({user: username}, 'highly_secure', { expiresIn: 60 * 60 });
  req.session.authenticated = {accessToken};
  return res.status(200).json(`registered user - ${username} successfully logged in`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const book = books[req.params.isbn];
  const user = req.session.user;
  if(!review) return res.status(404).json({message: "invalid review"});
  if(!book)  return res.status(404).json({message: "invalid isbn"});
  book.reviews[user] = review;
  return res.status(200).json({message: "review saved successfully", savedObject: book.reviews});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  const user = req.session.user;
  if(!book) return res.status(404).json({message: "invalid isbn"});
  if(!book.reviews[user])  return res.status(404).json({message: "invalid delete request"});
  delete book.reviews[user];
  return res.status(200).json({message: "review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
