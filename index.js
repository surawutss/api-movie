var express = require('express')
var cors = require('cors')
require('dotenv').config()

const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)

var app = express()
app.use(cors())
app.use(express.json())

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})


app.get('/movies', function (req, res, next) {
  connection.query(
    'SELECT * FROM `products`',
    function(err, results, fields) {
      res.json(results);
    }
  );
})

app.get('/list', function (req, res, next) {
  connection.query(
    'SELECT * FROM `list`',
    function(err, results, fields) {
      res.json(results);
    }
  );
})

app.post('/buy', function (req, res, next) {
  connection.query(
    'INSERT INTO `list`(`user_name`, `movie_name`, `date`) VALUES (?, ?, ?)',
    [req.body.user, req.body.title, req.body.date],
    function(err, results) {
      res.send([req.body.user, req.body.title, req.body.date]);
    }
  );
})

app.delete('/delete/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'DELETE FROM `list` WHERE id = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
})


app.put('/edit', function (req, res, next) {
  connection.query(
    'UPDATE `list` SET `user_name`= ?, `movie_name`= ?, `date`= ? WHERE id = ?',
    [req.body.name, req.body.movie, req.body.fDate, req.body.id],
    function(err, results) {
      res.send(results);
    }
  );
})



// http://localhost:5000/users
app.post('/users', function(request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) throw error;
      // If the account exists
      if (results.length > 0) {
        // Authenticate the user
          //request.session.loggedin = true;
          //request.session.username = username;
        // Redirect to home page
        response.send(results);
      } else {
        response.send('Incorrect Username and/or Password!');
      }     
      response.end();
    });
  } else {
    response.send('Please enter Username and Password!');
    response.end();
  }
});

app.post('/users/registry', function (req, res, next) {
  // Capture the input fields
  let fullName = req.body.fullName;
  let username = req.body.username;
  let password = req.body.password;
  let status    = req.body.status;
  // Ensure the input fields exists and are not empty
  if (fullName && username && password && status) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    connection.query('INSERT INTO `users`(`name`, `username`, `password`,  `status`) VALUES (?, ?, ?, ?)', [fullName, username, password, status], function(error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) throw error;
      // If the account exists
      res.send("success");
      res.end();
    });
  } else {
    res.send('Please enter information!');
    res.end();
  }
})

