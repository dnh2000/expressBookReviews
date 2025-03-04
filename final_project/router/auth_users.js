const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
 
const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

 

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in!"});
  }

  if (authenticatedUser (username, password)) {
    let accessToken = jwt.sign ({
        data: password
    }, 'access', { expiresIn: 60 * 60});


    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User succesfully logged in!!!");

  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password!!!"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const username = req.session.authorization.username;
    const review = req.query.review;
    const isbn = req.params.isbn;
    const book = books[isbn];
 
    if (book) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Book review succesfully added or modified."});
    } else {
      return res.status(404).json({message: "Book not found."});
    }
  });
  
  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
      //Write your code here
      const username = req.session.authorization.username;
      const isbn = req.params.isbn;

      if (books[isbn] && books[isbn].reviews[username]) {
          delete books[isbn].reviews[username]; 
          return res.send(`Review from ${username} deleted.`);
      } else if (books[isbn] && !books[isbn].reviews[username]){ 
        return res.send(`No review from ${username} to delete.`);
      } else {
          return res.status(404).json({message: "Book not found."});  
      }
    });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
