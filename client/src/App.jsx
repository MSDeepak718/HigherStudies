import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { AuthProvider } from "./authContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateProfile from "./pages/CreateProfile/CreateProfile";
import Profile from "./pages/Profile/Profile";
import "./App.css";
import ForgotPassword from "./pages/Login/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pwd-reset" element={<ForgotPassword />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/create" element={<CreateProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
