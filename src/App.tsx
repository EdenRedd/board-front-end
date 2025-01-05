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
        Welcome to KanbanIQ <code></code>
      </p>
      <Link to="/signup" className="App-link">
        Sign Up
      </Link>
      <Link to="/login" className="App-link">
        Login
      </Link>
      {/* Remove Kanban Board link */}
    </>
  );
};

export default App;
