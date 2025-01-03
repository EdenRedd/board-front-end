import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import KanbanBoard from "./components/KanbanBoard";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/kanban" element={<KanbanBoard />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <img src="./logo.svg" className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <Link to="/signup" className="App-link">
        Sign Up
      </Link>
      <Link to="/login" className="App-link">
        Login
      </Link>
      <Link to="/kanban" className="App-link">
        Kanban Board
      </Link>
      <button onClick={() => (window.location.href = "/login")}>
        Go to Login
      </button>
    </>
  );
};

export default App;
