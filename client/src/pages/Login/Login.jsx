import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import google from '../../assets/google.png';
import facebook from '../../assets/facebook.png';
import whatsapp from '../../assets/whatsapp.png';
import './Login.css';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  const handleLoginClick = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else if (username === "" || !username.includes('@')) {
      alert("Username is not in valid format");
    } else {
      try {
        const result = await authService.confirmPassword(username, password);
        alert(result.data.message);
        if (result.success) {
          navigate('/app');
        }
      } catch (err) {
        alert("Failed to reset the password");
      }
    }
  };

  return (
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
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [navigate]);

  const handleLoginClick = async () => {
    if (username.indexOf("@") === -1) {
      alert("Invalid Email");
      return;
    } else if (password < 8) {
      alert("Invalid Password");
      return;
    }
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        navigate('/app');
        alert("Logged in Successfully");
      } else {
        alert(result.data.error);
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgotPassword');
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
          <div className="forgot-password" onClick={handleForgotPassword}>
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

export default Login;
