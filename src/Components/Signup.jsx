import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Use Link

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");

        // ✅ Prevent sending empty fields
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5500/signup", {
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
                    <button type="submit" className="btn signup-btn">
                        Sign Up
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
