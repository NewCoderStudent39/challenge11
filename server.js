const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes for APIs
app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './db/db.json'))
);

// post to add new note to db.json
app.post('/api/notes', (req, res) => {
    const note = JSON.parse(fs.readFileSync('./db/db.json'));
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        note.push(newNote);

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }

    fs.writeFileSync('./db/db.json', JSON.stringify(note), "utf-8");
    res.json(note);
});

//  delete notes
app.delete('/api/notes/:id', (req, res) => {
    const note = JSON.parse(fs.readFileSync('./db/db.json'));
    const removeNote = note.filter((delNote) => delNote.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(removeNote));
    res.json(removeNote);
});

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () =>
    console.log(`Listening on http://localhost:${PORT} 🚀`)
);