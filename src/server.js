const express = require ("express");
const cors = require ("cors");
const multer = require('multer');
const mysql = require ("mysql2");
const app = express();
const xlsx = require('xlsx')
const ExcelJS = require('exceljs');
const bodyParser = require ("body-parser");
const port = 8080

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jungle24.",
  database: "books",
});
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

  app.post('/weka', upload.single('file'), (req, res) => {
    try {
      const buffer = req.file.buffer;
      const workbook = xlsx.read(buffer, { type: 'buffer' });
  
      if (workbook && workbook.SheetNames && workbook.SheetNames.length > 0) {
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
  
        res.json({ data });
      } else {
        throw new Error('Invalid Excel file format.');
      }
    } catch (error) {
      console.error('Error processing Excel file:', error.message);
      res.status(500).send('Error processing Excel file');
    }
  });

  app.post('/ongeza', (req, res) => {
    const dataForDatabase = req.body;
  
    // Assuming 'loanslist' is your table name
    const insertQuery = 'INSERT INTO loanslists (instanceId, Branch, Id, CustomerID, legalId, Name, loanAmount, Disbursmentdate, Matudate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
    const values = [
      dataForDatabase.instanceId,
      dataForDatabase.Branch,
      dataForDatabase.Id,
      dataForDatabase.CustomerID,
      dataForDatabase.legalId,
      dataForDatabase.Name,
      dataForDatabase.loanAmount,
      dataForDatabase.Disbursmentdate,
      dataForDatabase.Matudate,
    ];
  
    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Database query error: ' + err.stack);
        res.status(500).send('Error adding data to the database');
      } else {
        res.status(200).send('Data added to the database successfully');
      }
    });
  });

  app.post('/parse', upload.single('file'), async (req, res) => {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);
  
      const sheet = workbook.getWorksheet(1);
  
      // Convert sheet data to JSON
      const data = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          const rowData = {};
          row.eachCell((cell, colNumber) => {
            rowData[`Column${colNumber}`] = cell.value;
          });
          data.push(rowData);
        }
      });
  
      // Respond with the data
      res.status(200).json({ data });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while parsing the Excel file. Please try again.' });
    }
  });

  app.put('/update/:Id', (req, res) => {
    console.log(req.body);
    const { instanceId } = req.body; // Destructure name from req.body
    const IdToUpdate = req.params.Id;
  
    const query = 'UPDATE loanslist SET instanceId = ? WHERE Id = ? '; // Use name instead of newstate
    db.query(query, [instanceId, IdToUpdate], (err, result) => {
      if (err) {
        console.error('Database query error' + err.stack);
        res.status(500).send('Error updating data');
      } else {
        res.status(200).send('Data updated successfully');
      }
    });
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Execute a simple SQL query to check the user's credentials
    const sql = 'SELECT * FROM password WHERE username = ? AND password = ?';
    connection.query(sql, [username, password], (err, results) => {
      if (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An error occurred during login' });
      } else {
        if (results.length > 0) {
          // Authentication successful
          res.status(200).json({ message: 'Login successful' });
        } else {
          // Authentication failed
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    });
  });
  

app.listen(port, ()=> {
  console.log(`iko on ${port}`)
})