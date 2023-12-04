const express = require ("express");
const cors = require ("cors");
const mysql = require ("mysql2");
const app = express();
const bodyParser = require ("body-parser");
const port = 8080

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jungle24.",
  database: "books",
});
app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.message);
  } else {
    console.log("Connected to the database");
  }
});

app.get('/info', (req, res) => {
  const searchTerm = req.query.search; // Assuming the client sends the search term as a query parameter

  const query = `
    SELECT instanceid, Id, CustomerId, Name, loanAmount, state, availability 
    FROM loanslist 
    WHERE CustomerId LIKE ?`;

  db.query(query, [`%${searchTerm}%`], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results);
  });
});

app.post('/takeout', (req, res) =>{
  console.log(req.body);
  const { name, email, phone, datep, document, state } = req.body;
  const query = 'INSERT INTO users(name, email, phone, datep, document, state) VALUES(?, ?, ?, ?, ?, ? )';
  db.query(query, [name, email, phone, datep, document, state], (err, results) =>{
    if (err){
      console.error('database query error ' + err.stack);
      res.status(500).send('error inserting data');
    }else{
      res.status(200).send('data insterted successfully');
    }
  });
});

app.put('/take/:Id', (req,res) =>{
  const Idtoupdate = req.params.Id;
  const newstate = 'unavailable';

  const query = 'UPDATE loanslist SET availability = ? where Id = ? ';
  db.query(query, [newstate, Idtoupdate ], (err, result) => {
    if (err){
      console.error("database query error"+ err.stack);
      res.status(500).send('error sending data');
    }
    else{
      res.status(200).send('data inserted succesfully');
    }
  });
});
app.put('/return/:Id', (req,res) =>{
  const IdToupdate = req.params.Id;

if (!IdToupdate){
  return res.status(400).send('hakuna kitu morio');
}

  const newstate = 'available';
  const query = 'UPDATE loanslist SET availability = ? where Id = ? ';
  db.query(query, [newstate, IdToupdate ], (err, result) => {
    if (err){
      console.error("database query error"+ err.stack);
      res.status(500).send('error sending data');
    }
    else{
      res.status(200).send('data inserted succesfully');
    }
  });
});
app.get('/everything', (req, res) => {
  //Get the vehicle number from the URL parameter
    const query = 'SELECT name, datep, email, phone, state, document FROM users ';
  
    db.query(query, (err, results) => {
      if (err) {
        console.log("Database query error " + err.stack);
        res.status(500).send('Error retrieving data');
      } else {
        const userdata = results.map((row) => ({
          name: row.name,
          datep: row.datep,
          email: row.email,
          phone: row.phone,
          document:row.document,
          state:row.state,

        }));
  
        res.json(userdata);
      }
    });
  });

  app.put('/rudisha/:name/:datep/:document', (req, res) => {
    const id = req.params.document;
    const name = req.params.name;
    const date = req.params.datep;
    const newstate ='false'
  
    // Your SQL update query
    const query = 'UPDATE users SET state =? WHERE name = ?AND datep = ? AND document = ?';
  
    // Execute the query
    db.query(query, [newstate,name, date, id ], (err, result) => {
      if (err) {
        console.error('Database query error: ' + err.stack);
        res.status(500).send('Error updating data');
      } else {
        res.status(200).send('Data updated successfully');
      }
    });
  });

app.listen(port, ()=> {
  console.log(`iko on ${port}`)
})