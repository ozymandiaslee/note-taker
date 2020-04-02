//APP DEPENDENCIES
const express = require("express");
      path = require('path'),
      fs = require('fs'),
      util = require('util'),
      db = require('./db/db.json'),
      writeFile = util.promisify(fs.writeFile),
      readFile = util.promisify(fs.readFile),
      app = express(),
      PORT = process.env.PORT || 8080;

//EXPRESS INIT
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//GET ROUTING
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.get('/api/notes', (req,res) => {
  readFile('./db/db.json', 'utf-8').then(function(response){
    response = JSON.parse(response);
    return res.json(response);
  });
});

//POST&DELETE ROUTING USING FS PACKAGE TO "SAVE" DATA TO OUR DB.JSON FILE
app.post('/api/notes', (req, res) => {
  const note = req.body;
  readFile('./db/db.json', 'utf-8').then(function(response) {
    response = JSON.parse(response);
    response.push(note);
    response[response.length - 1].id = response.length - 1;
    writeFile('./db/db.json', JSON.stringify(response));
  });
  return res.send("saved");
});

app.delete('/api/notes/:id', (req, res) =>{
  const id = req.params.id;
  readFile('./db/db.json', 'utf-8').then(function(response){
    response = JSON.parse(response);
    response.splice(id, 1);
    for(let i = 0; i < response.length; i++){
      response[i].id = i;
    }
    writeFile('./db/db.json', JSON.stringify(response));
  })
  return res.send("deleted");
})

//LISTENER FOR EXPRESS SERVER
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
