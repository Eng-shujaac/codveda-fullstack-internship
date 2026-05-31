import React from "react";

function StatusMessage({ type = "info", message }) {
  if (!message) {
    return null;
  }

  return <p className={`status-message ${type}`}>{message}</p>;
}

export default StatusMessage;
