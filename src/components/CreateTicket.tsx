import React, { useState } from "react";

interface CreateTicketProps {
  onCreate: (title: string, description: string) => void;
}

const CreateTicket: React.FC<CreateTicketProps> = ({ onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="create-ticket-container">
      <h2>Create Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;
