import React, { useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "./api/authApi.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./api/taskApi.js";
import AuthPanel from "./components/AuthPanel.jsx";
import StatusMessage from "./components/StatusMessage.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";

const TOKEN_STORAGE_KEY = "codveda_auth_token";

function App() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || ""
  );
  const [currentUser, setCurrentUser] = useState(null);
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

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setCurrentUser(null);
        return;
      }

      try {
        const result = await getCurrentUser(token);
        setCurrentUser(result.data);
      } catch (error) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken("");
        setCurrentUser(null);
        setMessage({
          type: "error",
          text: "Your session expired. Please login again.",
        });
      }
    };

    loadCurrentUser();
  }, [token]);

  const saveAuthSession = (authResult) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, authResult.token);
    setToken(authResult.token);
    setCurrentUser(authResult.data);
  };

  const handleLogin = async (credentials) => {
    try {
      setMessage({ type: "info", text: "Logging in..." });
      const result = await loginUser(credentials);
      saveAuthSession(result);
      setMessage({ type: "success", text: "Login successful." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      setMessage({ type: "info", text: "Creating account..." });
      await registerUser(userData);
      const loginResult = await loginUser({
        email: userData.email,
        password: userData.password,
      });
      saveAuthSession(loginResult);
      setMessage({
        type: "success",
        text: "Registration successful. You are now logged in.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken("");
    setCurrentUser(null);
    setMessage({ type: "success", text: "Logged out successfully." });
  };

  const handleCreateTask = async (taskData) => {
    try {
      setMessage({ type: "info", text: "Creating task..." });
      await createTask(taskData, token);
      await loadTasks();
      setMessage({ type: "success", text: "Task created successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setMessage({ type: "info", text: "Updating task..." });
      await updateTask(taskId, { status: "completed" }, token);
      await loadTasks();
      setMessage({ type: "success", text: "Task marked as completed." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      setMessage({ type: "info", text: "Updating task..." });
      await updateTask(taskId, taskData, token);
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
      await deleteTask(taskId, token);
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

        {currentUser ? (
          <section className="panel account-panel">
            <div>
              <h2>Welcome, {currentUser.name}</h2>
              <p>{currentUser.email}</p>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </section>
        ) : (
          <AuthPanel onLogin={handleLogin} onRegister={handleRegister} />
        )}

        {currentUser ? (
          <TaskForm onCreateTask={handleCreateTask} />
        ) : (
          <p className="status-message">
            Please login to create, update, or delete tasks.
          </p>
        )}

        <StatusMessage
          type={message.type}
          message={isLoading ? "Loading tasks..." : message.text}
        />

        <TaskList
          tasks={tasks}
          canManageTasks={Boolean(currentUser)}
          onDeleteTask={handleDeleteTask}
          onCompleteTask={handleCompleteTask}
          onUpdateTask={handleUpdateTask}
        />
      </div>
    </main>
  );
}

export default App;
