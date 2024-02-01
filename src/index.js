const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// In-memory storage for tasks
let tasks = [];

// Middleware to parse JSON
app.use(bodyParser.json());

// Welcome message for the root path
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .revolving-name {
            font-size: 24px;
            font-weight: bold;
            animation: rotate 5s infinite linear;
          }
        </style>
      </head>
      <body>
        <p class="revolving-name">Welcome to the ToDo app, Kajal!</p>
      </body>
    </html>
  `);
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  tasks.push(task);
  res.json({ success: true, message: 'Task added successfully' });
});

// Delete a task by index
app.delete('/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0 || index >= tasks.length) {
    return res.status(400).json({ error: 'Invalid index' });
  }

  tasks.splice(index, 1);
  res.json({ success: true, message: 'Task deleted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
