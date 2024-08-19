import React, { useState, useEffect } from "react";
import './Signup.css';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }, []);

    const handleSignup = async (event) => {
        event.preventDefault();

        if (email.indexOf("@") === -1) {
            alert("Not a valid Email");
            return;
        } else if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        } else if (password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                localStorage.setItem('token', data.token); 
                navigate('/app');
                alert("Signed Up Successfully")
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Signup Error', error);
            alert("Error signing up. Please try again.");
        }
    };

    return (
        <div className="signup-page">
            <div className="login-container">
                <div className="login-header">
                    Signup
                </div>
                <form>
                    <div className="username-field">
                        <div className="label">
                            <h4>Email</h4>
                        </div>
                        <div className="input-field">
                            <input
                                name="email"
                                type="email"
                                placeholder="Type your email"
                                className="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="password-field">
                        <div className="label">
                            <h4>Create Password</h4>
                        </div>
                        <div className="input-field">
                            <input
                                name="password"
                                type="password"
                                placeholder="Type your password"
                                className="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="password-field">
                        <div className="label">
                            <h4>Confirm Password</h4>
                        </div>
                        <div className="input-field">
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                className="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="signup-button">
                        <button type="button" onClick={handleSignup}>Signup</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
