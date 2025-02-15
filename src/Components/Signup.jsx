import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Use Link
import './Signup.css'

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Loading state added
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.");
            return;
        }

        setLoading(true); // ✅ Start loading

        try {
            const response = await fetch("https://speech-to-text-backend-henna.vercel.app/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Signup failed. Please try again.");
                return;
            }

            alert("Signup successful! You can now log in.");
            navigate("/login");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }

        setLoading(false); // ✅ Stop loading after response
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
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
                    <button type="submit" className="btn signup-btn" disabled={loading}>
                        {loading ? <span className="spinner"></span> : "Sign Up"} {/* ✅ Show spinner when loading */}
                    </button>
                </form>
                <p className="switch-page">
                    Already have an account?{" "}
                    <Link to="/login" className="link">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
