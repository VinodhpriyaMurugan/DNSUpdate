import React, { useState } from "react";
import "./login.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../Assets/logo.png";
// import {  } from 'react-router-dom'
const Login = () => {
  localStorage.clear();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [pass, setPass] = useState();

  const handleLogin = (event) => {
    event.preventDefault();
    if (user === "admin" && pass === "admin") {
      localStorage.setItem("userLogged", user);
      localStorage.setItem("Role", "Admin");
      navigate("/dashboard", {
        state: { user: "Admin" },
      });
    } else {
      const loginValue = {
        user_name: user,
        password: pass,
      };
      axios
        .post("http://localhost:3100/api/users/login", loginValue)
        .then((Response) => {
          console.log("loginValue================>", Response.data);
          localStorage.setItem("userId", Response.data.id);
          localStorage.setItem("userLoggedIn", Response.data.email_id);
          localStorage.setItem("role", Response.data.role);
          localStorage.setItem("branch", Response.data.branch);
          localStorage.setItem("dept", Response.data.department);
          localStorage.setItem("user", Response.data.user_name);
          if (localStorage.getItem("role") === "admin,user") {
            console.log("Response.data.role", Response.data.role);
            navigate("/admin", {
              state: {
                user: Response.data.user_name,
                branch: Response.data.branch,
                dept: Response.data.department,
              },
            });
          } else if (Response.data.role === "user") {
            navigate("/user", {
              state: {
                value: false,
              },
            });
          }
        });
      // return
    }
  };

  return (
    <div className="page-body-login">
      <div className="Login">
        <div className="logo-header">
          <img src={logo} className="login-image"></img>
          <h3 className="login-header">Dsmart</h3>
        </div>

        <Form onSubmit={handleLogin}>
          <div className="form-div">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {/* <Form.Label>User Name</Form.Label> */}
              <Form.Control
                type="text"
                name="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="User name"
              />
            </Form.Group>
          </div>
          <div className="form-div">
            <Form.Group className="mb-3" controlId="formBasicPassword">
              {/* <Form.Label>Password</Form.Label> */}
              <Form.Control
                type="password"
                name="pass"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
              />
            </Form.Group>
          </div>

          <button variant="primary" className="login-submit-btn" type="submit">
            Submit
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
