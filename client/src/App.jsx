import { Route, Navigate, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateProfile from "./pages/CreateProfile/CreateProfile";
import Profile from "./pages/Profile/Profile";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/app" element={<Dashboard />} />
      <Route path="/create" element={<CreateProfile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
