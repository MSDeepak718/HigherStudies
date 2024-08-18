import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';
import google from './Assets/google.png';
import facebook from './Assets/facebook.png';
import whatsapp from './Assets/whatsapp.png';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Reset form fields when the component mounts or navigates to this page
    useEffect(() => {
        setUsername('');
        setPassword('');
    }, [navigate]);

    const handleLoginClick = async() => {
        if(username.indexOf("@")===-1){
            alert("Invalid Email")
            return;
        }else if(password<8){
            alert("Invalid Password")
            return;
        }
        try {
            const response = await fetch('http://localhost:5001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email:username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/app');
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Error logging in");
        }
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    Login
                </div>
                <div className="username-field">
                    <div className="label">
                        <h4>Username</h4>
                    </div>
                    <div className="input-field">
                        <input
                            name="username"
                            type="email"
                            placeholder="Type your username"
                            className="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="password-field">
                    <div className="label">
                        <h4>Password</h4>
                    </div>
                    <div className="input-field">
                        <input
                            name="password"
                            type="password"
                            placeholder="Type your Password"
                            className="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="forgot-password">
                        <p>Forgot password?</p>
                    </div>
                </div>
                <div className="login-button">
                    <button type="button" onClick={handleLoginClick}>Login</button>
                </div>
                <div className="sign-up">
                    <p>Signup Using</p>
                    <div className="logos">
                        <img src={google} alt="Google" />
                        <img src={facebook} alt="Facebook" />
                        <img src={whatsapp} alt="Whatsapp" />
                    </div>
                </div>
                <div className="signup-button">
                    <button type="button" onClick={handleSignupClick}>Signup</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
