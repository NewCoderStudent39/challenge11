const PORT = process.env.PORT || 3002;
const fs = require('fs');
const path = require('path');
const uniqueID = require('./helpers/Id')

const express = require('express');
const app = express();

const allNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', function(req, res) {
    res.sendFile(path.join(__dirname, './db/db.json'));
})

app.post('/api/notes', function(req, res) {
    const note = JSON.parse(fs.readFileSync('./db/db.json'));
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title: title, 
            text: text,
            id: uniqueID(),
        };
        note.push(newNote);

        const response = {
            status: 'it worked',
            body: newNote,
        };

        console.log(response);
        res.status(200).json(response);
    }
    else {
        res.status(500).json('Failed to post note');
    };

    fs.writeFileSync('./db/db.json', JSON.stringify(note), "utf-8");
    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    const note = JSON.parse(fs.readFileSync('./db/db.json'));
    const removeNote = note.filter((delNote) => delNote.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(removeNote));
    res.json(removeNote);
});

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
