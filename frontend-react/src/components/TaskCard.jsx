import React, { useState } from "react";

function TaskCard({ task, onDeleteTask, onCompleteTask, onUpdateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
  });

  const createdDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isCompleted = task.status === "completed";

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setEditData({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
    setIsEditing(false);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    await onUpdateTask(task.id, {
      title: editData.title.trim(),
      description: editData.description.trim(),
      status: editData.status,
    });

    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="task-card">
        <form className="edit-task-form" onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label htmlFor={`edit-title-${task.id}`}>Title</label>
            <input
              id={`edit-title-${task.id}`}
              name="title"
              type="text"
              value={editData.title}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-description-${task.id}`}>Description</label>
            <textarea
              id={`edit-description-${task.id}`}
              name="description"
              rows="3"
              value={editData.description}
              onChange={handleEditChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-status-${task.id}`}>Status</label>
            <select
              id={`edit-status-${task.id}`}
              name="status"
              value={editData.status}
              onChange={handleEditChange}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="task-actions">
            <button type="submit">Save</button>
            <button
              className="secondary-button"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="task-card">
      <div className="task-card-header">
        <div>
          <h3>{task.title}</h3>
          <p>{task.description || "No description provided."}</p>
        </div>

        <div className="task-actions">
          <button type="button" onClick={handleEditClick}>
            Edit
          </button>
          <button
            className="delete-button"
            type="button"
            onClick={() => onDeleteTask(task.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="task-meta">
        <span className={`task-status ${task.status}`}>{task.status}</span>
        <span>Created {createdDate}</span>
      </div>

      {!isCompleted && (
        <button
          className="secondary-button"
          type="button"
          onClick={() => onCompleteTask(task.id)}
        >
          Mark Completed
        </button>
      )}
    </article>
  );
}

export default TaskCard;
