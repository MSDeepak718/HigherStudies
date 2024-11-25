import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = ()=>{
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    }, []);

    const handleLoginClick = async() =>{
        if (password !== confirmPassword) {
            alert("Passwords do not match");
        }else if(username==="" || !username.includes('@')){
            alert("Username is not in valid format")
        }
        else{
            try{
                const response = await axios.post(`http://localhost:5000/confirm-password`,{
                    email: username,
                    newPassword: password
                })
                alert(response.data.message);
                if(response.status===200){
                    navigate('/app');
                }
            }catch(err){
                alert("Failed to reset the password");
            }
        }
    }
    return(
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    Forgot Password
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
                        <h4>New Password</h4>
                    </div>
                    <div className="input-field">
                        <input
                            name="password"
                            type="password"
                            placeholder="Type your Password"
                            className="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            name="password"
                            type="password"
                            placeholder="Type your Password"
                            className="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="login-button">
                    <button type="button" onClick={handleLoginClick}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword