import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Login.css'

const LoginPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Loading state added
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // ✅ Start loading

        try {
            const response = await fetch('https://speech-to-text-backend-henna.vercel.app/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsAuthenticated(true);
                navigate('/audioupload');
            } else {
                setError(data.error || "Invalid email or password");
            }
        } catch (error) {
            console.error('Login error:', error);
            setError("An error occurred during login. Please try again.");
        }

        setLoading(false); // ✅ Stop loading after response
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn login-btn" disabled={loading}>
                        {loading ? <span className="spinner"></span> : "Login"} {/* ✅ Show spinner when loading */}
                    </button>
                </form>
                <p className="switch-page">
                    Don't have an account?{" "}
                    <Link to="/signup" className="link">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
