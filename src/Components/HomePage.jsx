import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <div className="hero-section">
                <h1 className="website-name">Audio Transcriber</h1>
                <p className="tagline">Transform your audio into text effortlessly.</p>
                <div className="button-group">
                    <button className="btn login-btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
                    <button className="btn signup-btn" onClick={() => navigate("/signup")}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
