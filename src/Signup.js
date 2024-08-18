import React, { useState, useEffect } from "react";
import './Signup.css';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    // Reset form fields when component mounts
    useEffect(() => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }, []);

    const handleSignup = (event) => {
        event.preventDefault();
        if (password === confirmPassword && password.length>=8) {
            navigate('/app');
        } else if(email.indexOf("@")===-1){
            alert("Not a valid Email")
        }else if(password !== confirmPassword){
            alert("Passwords do not match to the confirm password!");
        }else{
            alert("Password Length is less than 8")
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
