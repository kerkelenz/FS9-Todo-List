// Your Todo List App implementation will go here!

let todos = [];

let todoForm;
let todoList;
let todoInput;
let todoCount;
let errorMessage;

document.addEventListener("DOMContentLoaded", function () {
  todoForm = document.querySelector("#todo-form");
  todoList = document.querySelector("#todo-list");
  todoInput = document.querySelector("#todo-input");
  todoCount = document.querySelector("#todo-count");
  errorMessage = document.querySelector("#error-message");

  console.log("DOM loaded", {
    todoForm,
    todoList,
    todoInput,
    todoCount,
    errorMessage,
  });

  loadTodosFromStorage();
  renderTodos();
  updateTodoCount();

  if (!todoForm || !todoList || !todoInput || !errorMessage) {
    console.error("Missing DOM references; todo app cannot work.");
    return;
  }

  todoForm.addEventListener("submit", handleFormSubmit);
  todoList.addEventListener("click", handleTodoListClick);
  todoList.addEventListener("change", handleTodoToggle);
});

function handleFormSubmit(event) {
  event.preventDefault();

  console.log("handleFormSubmit fired", {
    value: todoInput ? todoInput.value : null,
  });

  //Get the raw input from the text field and then trim it to remove whitespace
  if (!todoInput) {
    showErrorMessage("Input field not found.");
    return;
  }

  const rawTodoText = todoInput.value;
  const todoText = rawTodoText.trim();

  // Input validation
  if (!todoText) {
    showErrorMessage("Please enter a todo item");
    return;
  }

  // Check to see if todoText has a minimum length of three characters
  const minimumLength = 3;
  if (todoText.length < minimumLength) {
    showErrorMessage("Todo must be at least 3 characters long");
    return;
  }

  //Clear old error messages so the user doesn't see old errors
  hideErrorMessage();

  //Create a new todo with the validated text
  addTodo(todoText);
  todoInput.value = "";
}

//Show the error message element and set its content
function showErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  errorMessage.style.display = "block";

  //Hide message after 3 seconds
  setTimeout(function () {
    hideErrorMessage();
  }, 3000);
}

//Hide the error message element
function hideErrorMessage() {
  errorMessage.classList.remove("show");
  errorMessage.style.display = "none";
}

function addTodo(text) {
  // Create a new todo object with the text and a default completed status of false
  const newTodo = {
    id: Date.now(), // Unique ID based on timestamp
    text: text,
    completed: false,
    createdAt: new Date().toISOString(), // Store creation time for sorting
  };

  // Add the new todo to the todos array
  todos.push(newTodo);

  // Update the UI to reflect the new todo
  updateUI();
}

function updateUI() {
  saveTodosToStorage();
  renderTodos();
  updateTodoCount();
}

function handleTodoListClick(event) {
  const todoItem = event.target.closest(".todo-item");
  if (!todoItem) return; // Click was outside a todo item

  if (event.target.matches(".delete-btn")) {
    const todoId = Number(todoItem.dataset.id);
    deleteTodo(todoId);
  }
}

function handleTodoToggle(event) {
  if (!event.target.matches(".todo-checkbox")) return;

  const todoItem = event.target.closest(".todo-item");
  if (!todoItem) return;

  const todoId = Number(todoItem.dataset.id);
  toggleTodo(todoId);
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    const isTargetTodo = todo.id === id;
    if (isTargetTodo) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  updateUI();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  updateUI();
}

function renderTodos() {
  // Clear the existing list
  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No todos yet!</li>';
    updateTodoCount();
    return;
  }

  // Create and append todo items
  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });

  updateTodoCount();
}

function createTodoElement(todo) {
  const li = document.createElement("li");
  const completedClass = todo.completed ? "completed" : "";
  li.className = `todo-item ${completedClass}`;
  li.setAttribute("data-id", todo.id);

  const checkboxChecked = todo.completed ? "checked" : "";
  const checkBoxAction = todo.completed ? "incomplete" : "complete";

  li.innerHTML = `
        <input type="checkbox" class="todo-checkbox"
        ${checkboxChecked}
        aria-label="Mark ${todo.text} as ${checkBoxAction}">
        <span class="todo-text">${todo.text}</span>
        <div class="todo-actions">
            <button class="delete-btn" aria-label="Delete ${todo.text}">Delete</button>
        </div>
    `;

  const textSpan = li.querySelector(".todo-text");
  textSpan.textContent = todo.text;

  return li;
}

function saveTodosToStorage() {
  try {
    localStorage.setItem("todos", JSON.stringify(todos));
    console.log("Todos saved", todos);
  } catch (error) {
    console.error("Could not save todos to localStorage:", error);
  }
}

function loadTodosFromStorage() {
  try {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      todos = JSON.parse(storedTodos).map((todo) => ({
        ...todo,
        id: Number(todo.id),
      }));
      console.log("Todos loaded", todos);
    }
  } catch (error) {
    console.error("Could not load todos from localStorage:", error);
    todos = [];
  }
}

function updateTodoCount() {
  if (!todoCount) return;
  todoCount.textContent = `${todos.length} ${todos.length === 1 ? "todo" : "todos"}`;
}
