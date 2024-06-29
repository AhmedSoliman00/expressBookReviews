const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = []

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let matcheduser = users.find(
    (user) => user.username === username && user.password === password
  )
  if (matcheduser) {
    return true
  }
  return false
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }
  if (!authenticatedUser(req.body.username, req.body.password)) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  let token = jwt.sign({ username: req.body.username }, 'access')
  req.session.authorization = { accessToken: token }
  return res.status(200).json({ message: 'User logged in successfully' })
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  let isbn = req.params.isbn
  let review = req.body.review
  if (!review) {
    return res.status(400).json({ message: 'Review is required' })
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' })
  }
  books[isbn].reviews = review
  return res.status(300).json({ message: 'review is posted successfully' })
})

// delete review of a book

regd_users.delete('/auth/review/:isbn', (req, res) => {
  //Write your code here
  let isbn = req.params.isbn
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' })
  }
  books[isbn].reviews = null
  return res.status(200).json({ message: 'Review deleted successfully' })
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
