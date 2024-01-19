import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./login/Login";
import Home from "./home/Home";
import Display from "./display/Display";
import UserRegistrationForm from "./Admin/UserRegistrationForm";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Subuser from "./Admin/Subuser/Subuser";
import AdminDashboard from "./Admin/Dashboard/AdminDashboard";
import UserDashboard from "./Admin/Dashboard/UserDashboard";
import Implement from "./Admin/Implementation/Implement";
import Branch from "./Admin/Component/Branch";
import ApprovedTickets from "./display/ApprovedTickets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route index path="/login" element={<Login />}></Route>
        <Route index path="/dashboard" element={<Dashboard />}></Route>
        <Route index path="/admin" element={<AdminDashboard />}></Route>
        <Route index path="/user" element={<UserDashboard />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/display" element={<Display />}></Route>
        <Route path="/registration" element={<UserRegistrationForm />}></Route>
        <Route path="/subuser" element={<Subuser />}></Route>
        <Route path="/implement" element={<Implement />}></Route>
        <Route path="/component" element={<Branch />}></Route>
        <Route path="/dns" element={<ApprovedTickets />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
