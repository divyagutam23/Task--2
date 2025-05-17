// Elements
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = [];

// Load tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    tasks.forEach(task => addTaskToDOM(task));
  }
});

// Helper: Validate email with simple regex
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Hide error on input change for better UX
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    const errorEl = document.getElementById(input.id + 'Error');
    if (errorEl) errorEl.style.display = 'none';
  });
});

// Form submission
contactForm.addEventListener('submit', e => {
  e.preventDefault();

  let valid = true;

  if (nameInput.value.trim() === '') {
    nameError.style.display = 'block';
    valid = false;
  }
  if (!isValidEmail(emailInput.value.trim())) {
    emailError.style.display = 'block';
    valid = false;
  }
  if (messageInput.value.trim() === '') {
    messageError.style.display = 'block';
    valid = false;
  }

  if (!valid) return;

  // If valid, clear form and alert success
  alert('Form submitted successfully!');
  contactForm.reset();
});

// Add task button click
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    status: 'pending' // default status
  };

  tasks.push(newTask);
  saveTasks();
  addTaskToDOM(newTask);

  taskInput.value = '';
});

// Add task to DOM
function addTaskToDOM(task) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = task.text;
  if (task.status === 'completed') {
    span.classList.add('completed');
  }

  // Buttons container
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'task-actions';

  // Complete button
  const completeBtn = document.createElement('button');
  completeBtn.className = 'action-btn action-complete';
  completeBtn.title = 'Mark as Completed';
  completeBtn.innerHTML = '<i class="fas fa-check"></i>';
  completeBtn.addEventListener('click', () => {
    task.status = 'completed';
    span.classList.add('completed');
    saveTasks();
  });

  // Pending button
  const pendingBtn = document.createElement('button');
  pendingBtn.className = 'action-btn action-pending';
  pendingBtn.title = 'Mark as Pending';
  pendingBtn.innerHTML = '<i class="fas fa-hourglass-start"></i>';
  pendingBtn.addEventListener('click', () => {
    task.status = 'pending';
    span.classList.remove('completed');
    saveTasks();
  });

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn action-delete';
  deleteBtn.title = 'Delete Task';
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    taskList.removeChild(li);
    saveTasks();
  });

  actionsDiv.appendChild(completeBtn);
  actionsDiv.appendChild(pendingBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actionsDiv);

  taskList.appendChild(li);
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
