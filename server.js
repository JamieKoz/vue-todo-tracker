const express = require('express');
const app = express();
const port = 3000;

// serving static files from the public folder.
app.use(express.json());
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // You can replace './database.db' with ':memory:' to save the data to memory instead of a file 

db.serialize(function () {
    db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY, name TEXT, completed INTEGER, priority TEXT)');
});

// Create API endpoints to interact with SQLITE DB
// Get all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
    const { name, completed, priority } = req.body;
    db.run('INSERT INTO tasks (name, completed, priority) VALUES (?, ?, ?)', [name, completed, priority], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, name, completed, priority });
        }
    });
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { name, completed, priority } = req.body;
    db.run('UPDATE tasks SET name = ?, completed = ?, priority = ? WHERE id = ?', [name, completed, priority, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id, name, completed, priority });
        }
    });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id });
        }
    });
});
