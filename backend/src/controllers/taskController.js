import tasks from "../data/tasks.js";

export const getAllTasks = (req, res) => {
  res.json({
    status: "success",
    count: tasks.length,
    data: tasks,
  });
};

export const getTaskById = (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  res.json({
    status: "success",
    data: task,
  });
};

export const createTask = (req, res) => {
  const { title, description = "", status = "pending" } = req.body;

  if (!title) {
    return res.status(400).json({
      status: "fail",
      message: "Task title is required",
    });
  }

  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  res.status(201).json({
    status: "success",
    message: "Task created successfully",
    data: newTask,
  });
};

export const updateTask = (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  const { title, description, status } = req.body;

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.status = status ?? task.status;

  res.json({
    status: "success",
    message: "Task updated successfully",
    data: task,
  });
};

export const deleteTask = (req, res) => {
  const taskIndex = tasks.findIndex((item) => item.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1);

  res.json({
    status: "success",
    message: "Task deleted successfully",
    data: deletedTask[0],
  });
};
