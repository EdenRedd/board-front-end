import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTicket from "./CreateTicket";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
}

interface Board {
  id: number;
  name: string;
  tickets: Ticket[];
}

const KanbanBoard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate();

  const handleCreateTicket = (title: string, description: string) => {
    if (selectedBoardId === null) return;
    const newTicket: Ticket = {
      id: Date.now(),
      title,
      description,
      status: "To Do",
    };
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === selectedBoardId
          ? { ...board, tickets: [...board.tickets, newTicket] }
          : board
      )
    );
  };

  const moveTicket = (
    boardId: number,
    ticketId: number,
    newStatus: Ticket["status"]
  ) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tickets: board.tickets.map((ticket) =>
                ticket.id === ticketId
                  ? { ...ticket, status: newStatus }
                  : ticket
              ),
            }
          : board
      )
    );
  };

  const handleCreateBoard = () => {
    const newBoard: Board = {
      id: Date.now(),
      name: newBoardName,
      tickets: [],
    };
    setBoards([...boards, newBoard]);
    setNewBoardName("");
    setIsModalOpen(false);
  };

  const selectedBoard = boards.find((board) => board.id === selectedBoardId);

  return (
    <div className="kanban-container">
      <div className="kanban-sidebar">
        <h3>Boards</h3>
        <ul>
          {boards.map((board) => (
            <li key={board.id} onClick={() => setSelectedBoardId(board.id)}>
              {board.name}
            </li>
          ))}
        </ul>
        <button onClick={() => setIsModalOpen(true)}>Create New Board</button>
      </div>
      <div className="kanban-board">
        {selectedBoard ? (
          <>
            <h2>{selectedBoard.name}</h2>
            <CreateTicket onCreate={handleCreateTicket} />
            <div className="kanban-columns">
              <div className="kanban-column">
                <h3>To Do</h3>
                {selectedBoard.tickets
                  .filter((ticket) => ticket.status === "To Do")
                  .map((ticket) => (
                    <div key={ticket.id} className="kanban-ticket">
                      <h4>{ticket.title}</h4>
                      <p>{ticket.description}</p>
                      <button
                        onClick={() =>
                          moveTicket(selectedBoard.id, ticket.id, "In Progress")
                        }
                      >
                        Move to In Progress
                      </button>
                    </div>
                  ))}
              </div>
              <div className="kanban-column">
                <h3>In Progress</h3>
                {selectedBoard.tickets
                  .filter((ticket) => ticket.status === "In Progress")
                  .map((ticket) => (
                    <div key={ticket.id} className="kanban-ticket">
                      <h4>{ticket.title}</h4>
                      <p>{ticket.description}</p>
                      <button
                        onClick={() =>
                          moveTicket(selectedBoard.id, ticket.id, "To Do")
                        }
                      >
                        Move to To Do
                      </button>
                      <button
                        onClick={() =>
                          moveTicket(selectedBoard.id, ticket.id, "Done")
                        }
                      >
                        Move to Done
                      </button>
                    </div>
                  ))}
              </div>
              <div className="kanban-column">
                <h3>Done</h3>
                {selectedBoard.tickets
                  .filter((ticket) => ticket.status === "Done")
                  .map((ticket) => (
                    <div key={ticket.id} className="kanban-ticket">
                      <h4>{ticket.title}</h4>
                      <p>{ticket.description}</p>
                      <button
                        onClick={() =>
                          moveTicket(selectedBoard.id, ticket.id, "In Progress")
                        }
                      >
                        Move to In Progress
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : (
          <p>Please select a board</p>
        )}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Board</h2>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board Name"
            />
            <button onClick={handleCreateBoard}>Create</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default KanbanBoard;
