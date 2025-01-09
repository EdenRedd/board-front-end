import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CreateTicket from "./CreateTicket";
import axios from "axios";
import {
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
}

interface Board {
  id: string;
  boardName: string;
  tickets: Ticket[];
}

const poolData = {
  UserPoolId: "us-east-2_xnWIB5BRA", // Your User Pool ID
  ClientId: "33dm3ph8qk5d56js00vshbb11", // Your Client ID
};

const userPool = new CognitoUserPool(poolData);

const KanbanBoard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err: any, session: CognitoUserSession | null) => {
        if (err) {
          console.error("Error getting session:", err);
          return;
        }
        if (session) {
          const email = session.getIdToken().payload.email;
          console.log("User email:", email);
          setUserEmail(email);
        }
      });
    }
  }, []);

  const fetchBoards = async () => {
    if (!userEmail) return;
    const params = { userEmail: userEmail };
    console.log("GET request params:", JSON.stringify(params));
    try {
      const response = await axios.get(`${apiBaseUrl}/boards`, {
        params,
      });
      console.log("Fetched boards response:", response.data.data);
      const boardsData = Array.isArray(response.data.data)
        ? response.data.data.map((item: any) => ({
            id: item.boardName,
            boardName: item.boardName,
            tickets: [],
          }))
        : [];
      console.log("boards data:", boardsData);
      setBoards(boardsData);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleCreateTicket = async (title: string, description: string) => {
    if (selectedBoardId === null) return;
    const newTicket: Ticket = {
      id: Date.now().toString(),
      title,
      description,
      status: "To Do",
    };

    const ticketData = {
      boardName: selectedBoardId,
      ticketName: title,
    };
    console.log("POST request data:", JSON.stringify(ticketData));

    try {
      await axios.post(`${apiBaseUrl}/tickets`, ticketData);
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === selectedBoardId
            ? { ...board, tickets: [...board.tickets, newTicket] }
            : board
        )
      );
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    }
  };

  const moveTicket = (
    boardId: string,
    ticketId: string,
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

  const handleCreateBoard = async () => {
    if (!userEmail) {
      alert("User email not found. Please log in again.");
      return;
    }
    try {
      const response = await axios.post(`${apiBaseUrl}/boards`, {
        boardName: newBoardName,
        user_name: userEmail,
      });
      const newBoard: Board = {
        id: response.data.id,
        boardName: newBoardName,
        tickets: [],
      };
      setBoards([...boards, newBoard]);
      setNewBoardName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
    }
  };

  const selectedBoard =
    boards.find((board) => board.id === selectedBoardId) || null;

  return (
    <div className="kanban-container">
      <div className="kanban-sidebar">
        <h3>Boards</h3>
        <ul>
          {boards.map((board) => (
            <li
              key={board.boardName}
              onClick={() => setSelectedBoardId(board.id)}
            >
              {board.boardName}
            </li>
          ))}
        </ul>
        <button onClick={() => setIsModalOpen(true)}>Create New Board</button>
        <button onClick={fetchBoards}>Refresh Boards</button>
      </div>
      <div className="kanban-board">
        {selectedBoard ? (
          <>
            <h2>{selectedBoard.boardName}</h2>
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
