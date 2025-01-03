import React from "react";
import { useNavigate } from "react-router-dom";

const KanbanBoard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="kanban-board">
      <h2>Kanban Board</h2>
      <div className="kanban-columns">
        <div className="kanban-column">
          <h3>To Do</h3>
          {/* Add tasks here */}
        </div>
        <div className="kanban-column">
          <h3>In Progress</h3>
          {/* Add tasks here */}
        </div>
        <div className="kanban-column">
          <h3>Done</h3>
          {/* Add tasks here */}
        </div>
      </div>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default KanbanBoard;
