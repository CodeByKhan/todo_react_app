const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// In-memory storage for tasks
let tasks = [];

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (CSS and client-side JavaScript)
app.use(express.static('public'));

// Welcome message for the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
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
  io.emit('taskAdded', task); // Notify clients about the new task
  res.json({ success: true, message: 'Task added successfully' });
});

// Delete a task by index
app.delete('/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0 || index >= tasks.length) {
    return res.status(400).json({ error: 'Invalid index' });
  }

  const deletedTask = tasks.splice(index, 1)[0];
  io.emit('taskDeleted', deletedTask); // Notify clients about the deleted task
  res.json({ success: true, message: 'Task deleted successfully' });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Set up socket.io for real-time communication
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing tasks to the new user
  socket.emit('initialTasks', tasks);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
