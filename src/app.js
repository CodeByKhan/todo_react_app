const socket = io();

// Initial tasks rendering
socket.on('initialTasks', (tasks) => {
  renderTasks(tasks);
});

// Handle new task added
socket.on('taskAdded', (newTask) => {
  addTaskToList(newTask);
});

// Handle task deleted
socket.on('taskDeleted', (deletedTask) => {
  removeTaskFromList(deletedTask);
});

// Function to add a new task
function addTask() {
  const newTaskInput = document.getElementById('newTask');
  const newTask = newTaskInput.value.trim();

  if (newTask !== '') {
    socket.emit('addTask', { task: newTask });
    newTaskInput.value = '';
  }
}

// Function to render tasks on the page
function renderTasks(tasks) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  tasks.forEach(task => {
    addTaskToList(task);
  });
}

// Function to add a task to the list
function addTaskToList(task) {
  const taskList = document.getElementById('taskList');
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${task}</span>
    <button class="deleteButton" onclick="deleteTask('${task}')">Delete</button>
  `;
  taskList.appendChild(li);
}

// Function to remove a task from the list
function removeTaskFromList(deletedTask) {
  const taskList = document.getElementById('taskList');
  const taskItem = Array.from(taskList.children).find(li => li.textContent.includes(deletedTask));

  if (taskItem) {
    taskList.removeChild(taskItem);
  }
}

// Function to delete a task
function deleteTask(task) {
  socket.emit('deleteTask', { task });
}
