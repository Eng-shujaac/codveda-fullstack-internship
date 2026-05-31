import React, { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./api/taskApi.js";
import StatusMessage from "./components/StatusMessage.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadTasks = async () => {
    setIsLoading(true);
    setMessage({ type: "info", text: "Loading tasks..." });

    try {
      const result = await getTasks();
      setTasks(result.data);
      setMessage({ type: "", text: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      setMessage({ type: "info", text: "Creating task..." });
      await createTask(taskData);
      await loadTasks();
      setMessage({ type: "success", text: "Task created successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setMessage({ type: "info", text: "Updating task..." });
      await updateTask(taskId, { status: "completed" });
      await loadTasks();
      setMessage({ type: "success", text: "Task marked as completed." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      setMessage({ type: "info", text: "Updating task..." });
      await updateTask(taskId, taskData);
      await loadTasks();
      setMessage({ type: "success", text: "Task updated successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setMessage({ type: "info", text: "Deleting task..." });
      await deleteTask(taskId);
      await loadTasks();
      setMessage({ type: "success", text: "Task deleted successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  return (
    <main className="page">
      <div className="container">
        <header className="page-header">
          <h1>Task Management System</h1>
          <p>React frontend for the Codveda Full-Stack Development Internship</p>
        </header>

        <TaskForm onCreateTask={handleCreateTask} />

        <StatusMessage
          type={message.type}
          message={isLoading ? "Loading tasks..." : message.text}
        />

        <TaskList
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleCompleteTask}
          onUpdateTask={handleUpdateTask}
        />
      </div>
    </main>
  );
}

export default App;
