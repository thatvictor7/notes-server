'use strict'

var express = require('express')
var app = express()

var fs = require('fs')
var path = require('path')
var notesPath = path.join(__dirname, 'notes.json')

app.disable('x-powered-by');
app.set('port', process.env.PORT || 5000);

var morgan = require('morgan');
app.use(morgan('short'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

// app.get('/notes', function(req,res) {
//     res.send(notes)
// })

// app.get('/notes/:id', function (req, res) {
//     var id = Number.parseInt(req.params.id);

//     if (Number.isNaN(id) || id < 0 || id >= notes.length) {
//         return res.sendStatus(404);
//     }

//     res.send(notes[id]);
// })

// app.post('/notes', function (req, res) {
//     var note = req.body;

//     if (!note) {
//         return res.sendStatus(400);
//     }

//     notes.push(note);

//     res.send(note);
// });

// app.put('/notes/:id', function (req, res) {
//     var id = Number.parseInt(req.params.id);

//     if (Number.isNaN(id) || id < 0 || id >= notes.length) {
//         return res.sendStatus(404);
//     }

//     var note = req.body;

//     if (!note) {
//         return res.sendStatus(400);
//     }

//     notes[id] = note;

//     res.send(note);
// });

// app.delete('/notes/:id', function (req, res) {
//     var id = Number.parseInt(req.params.id);

//     if (Number.isNaN(id) || id < 0 || id >= notes.length) {
//         return res.sendStatus(404);
//     }

//     var note = notes.splice(id, 1)[0];

//     res.send(note);
// });

// 
// 
app.get('/notes', function (req, res) {
    fs.readFile(notesPath, 'utf8', function(err, notesJSON){
        if(err){
            console.error(err.stack)
            return res.sendStatus(500)
        }

        var notes = JSON.parse(notesJSON)

        res.send(notes)
    })
});

app.get('/notes/:id', function (req, res) {
    fs.readFile(notesPath, 'utf8', function (err, notesJSON) {
        if (err) {
            console.error(err.stack)
            return res.sendStatus(500)
        }

        var id = Number.parseInt(req.params.id)
        var notes = JSON.parse(notesJSON)

        if(id < 0 || id >= notes.length || Number.isNaN(id)){
            return res.sendStatus(404)
        }

        res.set('Content-Type', 'text/plain')
        res.send(notes.userNotes[id])
    })
});

app.post('/notes', function (req, res) {
    fs.readFile(notesPath, 'utf8', function(readErr, notesJSON){
        if(readErr){
            console.error(readErr.stack)
            return res.sendStatus(500)
        }

        var notes = JSON.parse(notesJSON)
        var noteName = req.body.name
        var noteBody = req.body.note
        var note = {
            [noteName]: noteBody
        }

        if (!noteName || !noteBody){
            console.log('400!!!');
            return res.sendStatus(400)
        }

        notes.userNotes.push(note)

        var newNotesJSON = JSON.stringify(notes)

        fs.writeFile(notesPath, newNotesJSON, function(writeErr){
            if(writeErr){
                console.error(writeErr.stack)
                return res.sendStatus(500)
            }
        })

        res.set('Content-Type', 'text/plain')
        res.send(notes)
    })
});

app.put('/notes/:id', function (req, res) {
    fs.readFile(notesPath, 'utf8', function(readErr, notesJSON){
        if(readErr){
            console.error(readErr.stack)
            return res.sendStatus(500)
        }

        var id = Number.parseInt(req.params.id)
        var notes = JSON.parse(notesJSON)
        var noteName = req.body.name
        var noteBody = req.body.note


        if (id < 0 || Number.isNaN(id) || id >= notes.length){
            return res.sendStatus(404)
        }

        if (!noteName || !noteBody) {
            console.log('400!!!');
            return res.sendStatus(400)
        }

        notes.userNotes[id] = {[noteName]: noteBody}

        var newNotesJSON = JSON.stringify(notes)

        fs.writeFile(notesPath, newNotesJSON, function(writeErr){
            if(writeErr){
                console.error(writeErr.stack)
                return res.sendStatus(500)
            }
        })

        res.set('Content-Type', 'text/plain')
        res.send(notes.userNotes[id])
    })
});

app.delete('/notes/:id', function (req, res) {
    fs.readFile(notesPath, 'utf8', function(readErr, notesJSON){
        if(readErr){
            console.error(readErr.stack)
            return res.sendStatus(500)
        }

        var id = Number.parseInt(req.params.id)
        var notes = JSON.parse(notesJSON)

        if (id < 0 || Number.isNaN(id) || id >= notes.length) {
            return res.sendStatus(404)
        }

        notes.userNotes.splice(id, 1)
        var newNotesJSON = JSON.stringify(notes)

        fs.writeFile(notesPath, newNotesJSON, function(writeErr){
            if(writeErr){
                console.error(writeErr.stack)
                return res.sendStatus(500)
            }
        })

        res.set('Content-Type', 'text/plain')
        res.send(notes)
    })
});

app.listen(app.get('port'), function () {
    console.log('Listening on', app.get('port'));
});