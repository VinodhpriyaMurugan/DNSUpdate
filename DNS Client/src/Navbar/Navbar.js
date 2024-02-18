import "../Admin/Dashboard/Dashboard.css";
import userImg from "../Assets/user-circle-svgrepo-com.svg";
import logout from "../Assets/logout-exit-svgrepo-com.svg";
import settings from "../Assets/settings-gear-combination-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/logo.png";
import "../Admin/Dashboard/Dashboard.css";
import Implement from "../Assets/carry-out-svgrepo-com.svg";
import create from "../Assets/add-ellipse-svgrepo-com.svg";
import record from "../Assets/report-text-svgrepo-com.svg";
import home from "../Assets/home-svgrepo-com.svg";

import "./Navbar.css";
import { Button, IconButton } from "@mui/material";
export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  const handleImplementBtn = () => {
    navigate("/user", {
      state: { value: false },
    });
  };
  const handleHome = () => {
    navigate("/dashboard", {
      state: { user: "Admin" },
    });
  };
  const handleCreate = () => {
    navigate("/home");
  };
  const getAllApproved = () => {
    navigate("/user", {
      state: { value: "true" },
    });
  };
  const handleCreateUser = () => {
    navigate("/registration");
  };
  const handleComponent = () => {
    navigate("/component");
  };
  return (
    <div className="page-body">
      <div className="work-area">
        <div className="top-navbar">
          <div className="header">
            <div className="inner-title">
              <img src={logo} className="logo-image"></img>
              <h4 className="title-tag">D-SMART</h4>
            </div>
          </div>
          <div className="header">
            <Button
              style={{ background: "Dodgerblue", color: "white" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
            {/* <img src={logout} alt="" className="logout-btn"></img> */}
            {/* <button className='serach-btn'>Search</button> */}
          </div>
        </div>
        {localStorage.getItem("role") === "user" ? (
          <div className="side-navbar">
            <div className="side-bar-components">
              {/* <img className="admin-img" src={userImg} alt=""></img> */}
              <div className="page-components">
                {/* <button
                  className="logout-btn"
                  onClick={getAllApproved}
                  title="Create Record"
                >
                  <img className="admin-img" src={userImg} alt=""></img>
                </button> */}

                {/* <button
                  className="logout-btn"
                  onClick={handleCreate}
                  title="Create Record"
                >
                  <img className="navbar-buttons" src={create}></img>
                </button> */}

                {/* <button
                  className="logout-btn"
                  onClick={getAllApproved}
                  title="Records"
                >
                  <img className="navbar-buttons" src={record}></img>
                </button> */}
              </div>
              {/* <div className="logout-div">
                <button className="logout-btn">
                  <img src={settings} alt="" className="settings-btn"></img>
                </button>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="side-navbar">
            <div className="side-bar-components">
              <img className="admin-img" src={userImg} alt=""></img>
              <div className="page-components">
                <button
                  className="logout-btn"
                  onClick={handleHome}
                  title="Implementation"
                >
                  <img className="navbar-buttons" src={home}></img>
                </button>
                <button
                  className="logout-btn"
                  onClick={handleImplementBtn}
                  title="My Records"
                >
                  <img className="navbar-buttons" src={Implement}></img>
                </button>
                <button
                  className="logout-btn"
                  onClick={handleCreateUser}
                  title="Add user"
                >
                  <img className="navbar-buttons" src={create}></img>
                </button>
                {/* <button
                  className="logout-btn"
                  onClick={handleComponent}
                  title="Component"
                >
                  <img src={settings} alt="" className="settings-btn"></img>
                </button> */}
              </div>
              {/* <div className="logout-div">
                <button className="logout-btn">
                  <img src={settings} alt="" className="settings-btn"></img>
                </button>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
