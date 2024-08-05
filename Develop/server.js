// Import Resources

// We want access to backend so we need to import express
const express = require("express");
// We are going to be reaading and writing to a file
const fs = require("fs");

// ? not really sure what this does
const path = require('path');

// ?
const uuid = require('./helpers/uuid');

//Where we are going to be importing, focus on Render.com after modularizing
PORT = 3001;

// Create app  for express
const app = express();

// Incoreperate middleware for parsing JSON and url encoded data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware to serve yo static assets from the public folder
app.use(express.static('public'));

// Create HTML Routes

// GET * should return the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// GET /notes should return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Create API Routes

// GET /api/notes should read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request was sent to return all saved notes`);
    //read json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            //return all saved notes as json
            res.send(JSON.parse(data));
        }
    })
})

// POST /api/notes should recieve a new note to save on the request body, add it to the db.json file, 
// and then return the new note to the client. You'll need to find a way to give each note a unique id 
// when it's saved (look into npm packages that could do this for you).

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a new note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: uuid()
      };

      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);

            // Add new note
            parsedNotes.push(newNote);

            //write updated notes back into file
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (writeErr) => {
                writeErr ? console.error(writeErr) : console.info('Successfully updated Notes!');
            });
        }
      });

      const response = {
        status: 'sucess',
        body: newNote
      };

      console.log(response);
      res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
      
    });

// BONUS: DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
// In order to delete a note, you'll need to read all notes from the db.json file, remove the note with 
// the given id property, and then rewrite the notes to the db.json file.

// Create listen to activate server
app.listen(PORT, () =>{
    console.log(`App listening at http://localhost:${PORT}`);
})