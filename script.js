// selecting app needed elements from DOM
const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");
const taskList = document.querySelector(".task-list");
const newTaskInput = document.querySelector("#newTaskInput");
const addTaskButton = document.querySelector("#addTaskButton");

// get tasks from local storage or initialized an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// function to save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgressBar();
};

// function to render a single task item
const renderTask = (task) => {
  const listItem = document.createElement("li");
  listItem.classList.add("task-item");

  // if task is completed add completed class that will add a line through the task
  if (task.completed) {
    listItem.classList.add("completed");
  }

  listItem.dataset.id = task.id;

  // each list item has a checkbox, task text (checked/unchecked), edit icon, delete icon
  listItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${
              task.completed ? "checked" : ""
            }>
            <span class="task-text">${task.text}</span>
            <button class="edit-button">✏️</button>
            <button class="delete-button">🗑️</button>
        `;

  // event lisnter for checkbox toggle
  listItem.querySelector(".task-checkbox").addEventListener("change", (e) => {
    task.completed = e.target.checked;
    if (task.completed) {
      listItem.classList.add("completed");
    } else {
      listItem.classList.remove("completed");
    }
    saveTasks();
  });

  // event listener for edit button
  listItem.querySelector(".edit-button").addEventListener("click", () => {
    const currentTextSpan = listItem.querySelector(".task-text");
    const currentText = currentTextSpan.textContent;

    // create input field for editing
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = currentText;
    editInput.classList.add("edit-task-input");

    // replace the span with the input field
    listItem.replaceChild(editInput, currentTextSpan);
    editInput.focus();

    // saving the edit
    const saveEdit = () => {
      task.text = editInput.value.trim();
      listItem.replaceChild(currentTextSpan, editInput);
      currentTextSpan.textContent = task.text;
      saveTasks();
      renderTasks();
    };

    editInput.addEventListener("blur", saveEdit);
    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      }
    });
  });

  // event listener for delete button
  listItem.querySelector(".delete-button").addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  return listItem;
};

// function to render all tasks
const renderTasks = () => {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    taskList.appendChild(renderTask(task));
  });
  updateProgressBar();
};

// function to update the progress bar and text
const updateProgressBar = () => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  progressBar.style.width = `${progressPercentage}%`;
  progressText.textContent = `${completedTasks}/${totalTasks} Completed`;
};

// add new task
addTaskButton.addEventListener("click", () => {
  const taskText = newTaskInput.value.trim();
  if (taskText) {
    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    newTaskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

// allow adding tasks with Enter key
newTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTaskButton.click();
  }
});

// initial render when the page loads
renderTasks();
