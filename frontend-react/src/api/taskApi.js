const API_URL = "http://localhost:5000/api/tasks";

const getAuthHeaders = (token) => {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getTasks = async () => {
  const response = await fetch(API_URL);
  return handleResponse(response);
};

export const createTask = async (taskData, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(taskData),
  });

  return handleResponse(response);
};

export const updateTask = async (taskId, taskData, token) => {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(taskData),
  });

  return handleResponse(response);
};

export const deleteTask = async (taskId, token) => {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(token),
    },
  });

  return handleResponse(response);
};
