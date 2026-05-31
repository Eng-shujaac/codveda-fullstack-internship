import React, { useState } from "react";

function TaskForm({ onCreateTask }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onCreateTask({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
    });

    setFormData({
      title: "",
      description: "",
      status: "pending",
    });
  };

  return (
    <section className="panel" aria-labelledby="form-title">
      <h2 id="form-title">Create New Task</h2>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit">Add Task</button>
      </form>
    </section>
  );
}

export default TaskForm;
