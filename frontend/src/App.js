import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaCalendarCheck, FaUpload, FaChartLine, FaTable, FaTools } from "react-icons/fa";

const App = () => {
  return (
    <Router>
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo"><FaCalendarCheck /></div>
            <h2>Class Scheduler</h2>
          </div>

          <nav className="sidebar-nav">
            <NavLink to="/" end className="nav-item">
              <span className="nav-icon"><FaUpload /></span> Upload CSV
            </NavLink>
            <NavLink to="/stats" className="nav-item">
              <span className="nav-icon"><FaChartLine /></span> Stats
            </NavLink>
            <NavLink to="/report" className="nav-item">
              <span className="nav-icon"><FaTable /></span> Report
            </NavLink>
            <NavLink to="/config" className="nav-item">
              <span className="nav-icon"><FaTools /></span> Configuration
            </NavLink>
          </nav>
        </aside>
    
      </div>
    </Router>
  );
};

export default App;
