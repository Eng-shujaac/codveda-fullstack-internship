const API_URL = "http://localhost:5000/api/tasks";

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const message = document.getElementById("message");
const taskCount = document.getElementById("task-count");

const setMessage = (text, type = "") => {
  message.textContent = text;
  message.className = `message ${type}`.trim();
};

const formatDate = (dateValue) => {
  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const renderTasks = (tasks) => {
  taskList.innerHTML = "";
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="message">No tasks found. Add your first task.</p>';
    return;
  }

  tasks.forEach((task) => {
    const taskCard = document.createElement("article");
    taskCard.className = "task-card";

    const cardHeader = document.createElement("div");
    cardHeader.className = "task-card-header";

    const taskContent = document.createElement("div");
    const taskTitle = document.createElement("h3");
    const taskDescription = document.createElement("p");

    taskTitle.textContent = task.title;
    taskDescription.textContent = task.description || "No description provided.";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.dataset.id = task.id;
    deleteButton.textContent = "Delete";

    const taskMeta = document.createElement("div");
    taskMeta.className = "task-meta";

    const taskStatus = document.createElement("span");
    taskStatus.className = `status ${task.status}`;
    taskStatus.textContent = task.status;

    const taskDate = document.createElement("span");
    taskDate.textContent = `Created ${formatDate(task.createdAt)}`;

    taskContent.append(taskTitle, taskDescription);
    cardHeader.append(taskContent, deleteButton);
    taskMeta.append(taskStatus, taskDate);
    taskCard.append(cardHeader, taskMeta);

    taskList.appendChild(taskCard);
  });
};

const fetchTasks = async () => {
  setMessage("Loading tasks...");

  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch tasks");
    }

    renderTasks(result.data);
    setMessage("");
  } catch (error) {
    taskList.innerHTML = "";
    taskCount.textContent = "0 tasks";
    setMessage(error.message, "error");
  }
};

const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create task");
  }

  return result;
};

const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete task");
  }

  return result;
};

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const taskData = {
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    status: formData.get("status"),
  };

  try {
    setMessage("Creating task...");
    await createTask(taskData);
    taskForm.reset();
    await fetchTasks();
    setMessage("Task created successfully.", "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
});

taskList.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("delete-button")) {
    return;
  }

  const taskId = event.target.dataset.id;

  try {
    setMessage("Deleting task...");
    await deleteTask(taskId);
    await fetchTasks();
    setMessage("Task deleted successfully.", "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
});

fetchTasks();
