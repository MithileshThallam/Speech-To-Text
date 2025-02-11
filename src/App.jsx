import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Components/HomePage.jsx";
import LoginPage from "./Components/Login.jsx";
import SignupPage from "./Components/Signup.jsx";
import AudioUpload from "./Components/AudioUploader.jsx";
import "./App.css";

const App = () => {
    // Load authentication state from localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );

    // Update localStorage whenever authentication changes
    useEffect(() => {
        localStorage.setItem("isAuthenticated", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/signup" element={<SignupPage />} />
                    {/* ✅ Protected Route: Redirect if not logged in */}
                    <Route path="/audioupload" element={isAuthenticated ? <AudioUpload /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
