const express = require('express')
let books = require('./booksdb.js')
const axios = require('axios')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
  const { username, password } = req.body

  // Check if both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }
  console.log(username, password)

  // Check if the username already exists
  const userExists = users.some((user) => user.username === username)
  if (userExists) {
    return res.status(409).json({ message: 'Username already exists' })
  }

  // Add the new user
  users.push({ username, password }) // In a real application, the password should be hashed before storing

  // Return success message
  return res.status(201).json({ message: 'User registered successfully' })
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books)
  //Write your code here
})

async function getBooks() {
  try {
    const response = await axios.get('http://localhost:5000');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getBooks();



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  if (books[isbn]) {
    return res.status(200).json(books[isbn])
  } else {
    return res.status(404).json({ message: 'Book not found' })
  }
})

async function getBookByIspn() {
  try {
    const response = await axios.get('http://localhost:5000/isbn/1');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getBookByIspn();

// Get book details based on author

function urlSlugToTitleCase(slug) {
  return slug
    .split('-') // Split the slug by hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' ') // Join the words back into a string, separated by spaces
}

public_users.get('/author/:author', function (req, res) {
  let author = urlSlugToTitleCase(req.params.author)
  let booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  )

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor)
  } else {
    return res.status(404).json({ message: 'Author not found' })
  }
})

async function getBookByAuthor() {
  try {
    const response = await axios.get('http://localhost:5000/author/chinua-achebe');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getBookByAuthor();


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let title = urlSlugToTitleCase(req.params.title)
  let booksByTitle = Object.values(books).filter((book) => book.title === title)
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle)
  }
  return res.status(404).json({ message: 'Book not found' })
})

async function getBookByTitle() {
  try {
    const response = await axios.get('http://localhost:5000/title/the-book-of-job');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

getBookByTitle();

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let book = books[isbn]
  if (book) return res.status(200).json(book.reviews)

  return res.status(404).json({ message: 'Book not found' })
})

module.exports.general = public_users
