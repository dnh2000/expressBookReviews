const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
  //Write your code here
 
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User succesfully registered. Now you can login."});
    } else {
        return res.status(404).json({messgage: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({message: "Book not found."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const booksByAuthor = []
  Object.keys(books).forEach(key => {
    if ( books[key].author === req.params.author){
        booksByAuthor.push(books[key]);
    }
    });
    if (booksByAuthor.length === 0) {
        return res.status(404).json({message: "No books found."});  
    }  else {
    return res.send(booksByAuthor);
     }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const booksByTitle = []
  Object.keys(books).forEach(key => {
    if ( books[key].title === req.params.title){
        booksByTitle.push(books[key]);
    }
    });    
    if (booksByTitle.length === 0) {
        return res.status(404).json({message: "No books found."});  
    }  else {
        return res.send(booksByTitle);
     }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      return res.status(404).json({message: "Book not found."});
    }
});

//  Get book list with Promise

public_users.get('/promise/',function(req,res) {

    const get_books = new Promise ((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));        
    });
    get_books.then(() => console.log("Promise resolved."));


});

// Get book details based on isbn with Promise
public_users.get('/promise/isbn/:isbn',function(req,res) {

    const get_books = new Promise ((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) {
            resolve(res.send(JSON.stringify({book}, null, 4))); 
        } else {
          resolve(res.status(404).json({message: "Book not found."}));
        }
               
    });
    get_books.then(() => console.log("Promise resolved."));


});

// Get book details based on author with Promise
public_users.get('/promise/author/:author',function(req,res) {

    const get_books = new Promise ((resolve, reject) => {

        const booksByAuthor = []
        Object.keys(books).forEach(key => {
          if ( books[key].author === req.params.author){
              booksByAuthor.push(books[key]);
          }
          });
          if (booksByAuthor.length === 0) {
              resolve(res.status(404).json({message: "No books found."}));  
          }  else {
            resolve(res.send(JSON.stringify({booksByAuthor}, null, 4))); 
           }      
    });
    get_books.then(() => console.log("Promise resolved."));


});


// Get book details based on title with Promise

public_users.get('/promise/title/:title',function(req,res) {

    const get_books = new Promise ((resolve, reject) => {


        const booksByTitle = []
        Object.keys(books).forEach(key => {
          if ( books[key].title === req.params.title){
              booksByTitle.push(books[key]);
          }
          });    
          if (booksByTitle.length === 0) {
              resolve(res.status(404).json({message: "No books found."}));  
          }  else {
            resolve(res.send(JSON.stringify({booksByTitle}, null, 4)));  
           } 
    });
    get_books.then(() => console.log("Promise resolved."));


});







module.exports.general = public_users;
