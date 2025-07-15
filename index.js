const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  
  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-tasks"></i>
        <h3>No tasks yet</h3>
        <p>Add your first task to get started!</p>
      </div>
    `;
    return;
  }
  
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="edit" data-id="${index}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="delete" data-id="${index}">
          <i class="fas fa-trash"></i> Delete
        </button>
        <button class="complete" data-id="${index}">
          <i class="fas fa-${task.completed ? "undo" : "check"}"></i> ${task.completed ? "Undo" : "Complete"}
        </button>
      </div>
    `;
    taskList.appendChild(li);
    
    setTimeout(() => {
      li.style.opacity = 1;
      li.style.transform = "translateX(0)";
    }, 10);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  renderTasks();
});

taskList.addEventListener("click", (e) => {
  const id = e.target.closest("button")?.getAttribute("data-id");
  if (id === null) return;
  
  if (e.target.closest(".delete")) {
    const taskItem = e.target.closest(".task-item");
    taskItem.classList.add("removing");
    
    setTimeout(() => {
      tasks.splice(id, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }, 300);
  }

  if (e.target.closest(".edit")) {
    const newText = prompt("Edit task:", tasks[id].text);
    if (newText !== null && newText.trim() !== "") {
      tasks[id].text = newText.trim();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  }

  if (e.target.closest(".complete")) {
    tasks[id].completed = !tasks[id].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
});

renderTasks();