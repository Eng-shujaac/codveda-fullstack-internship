import React from "react";
import TaskCard from "./TaskCard.jsx";

function TaskList({ tasks, onDeleteTask, onCompleteTask, onUpdateTask }) {
  if (tasks.length === 0) {
    return (
      <section className="panel">
        <div className="section-header">
          <h2>Tasks</h2>
          <p>0 tasks</p>
        </div>
        <p className="empty-state">No tasks found. Add your first task.</p>
      </section>
    );
  }

  return (
    <section className="panel" aria-labelledby="tasks-title">
      <div className="section-header">
        <h2 id="tasks-title">Tasks</h2>
        <p>
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDeleteTask={onDeleteTask}
            onCompleteTask={onCompleteTask}
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
    </section>
  );
}

export default TaskList;
