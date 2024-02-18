import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import countryList from "react-select-country-list";
import Navbar from "../Navbar/Navbar";
import "./Registration.css";
import { useNavigate } from "react-router-dom";
import { ErrorToastAlert, SuccessToastAlert } from "./Toast";
import Subuser from "./Subuser/Subuser";
const baseUrl = "http://localhost:3100";

function RegistrationForm(props) {
  const navigate = useNavigate();
  const userValue = props.user;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [department, setDepartment] = useState("");
  const [userType, setUserType] = useState([]);
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [geo, setGeo] = useState("");
  const optionsCountryList = countryList().getData();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/component/getAll`);
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    if (userValue) {
      axios
        .get(`${baseUrl}/api/users/getUser/${userValue}`)
        .then((response) => {
          console.log("User id", userValue);
          const userData = response.data;
          setName(userData.user_name);
          setEmail(userData.email_id);
          setUserId(userData.user_id);
          setDepartment(userData.department);
          setUserType(userData.userType.split(","));
          setSelectedRole(userData.selectedRole);
          setPassword(userData.password);
        });
    }

    fetchBranches();
  }, []);

  const handleBranchChange = async (selectedOption) => {
    setSelectedBranch(selectedOption);
    setSelectedDepartment(null);

    if (selectedOption) {
      try {
        const response = await axios.get(
          `${baseUrl}/api/component/dept/getAll/${selectedOption.value}`
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    } else {
      setDepartments([]);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  const handleUserTypeChange = (e) => {
    const selectedUserType = [...userType];
    if (e.target.checked) {
      selectedUserType.push(e.target.value);
    } else {
      const index = selectedUserType.indexOf(e.target.value);
      if (index !== -1) {
        selectedUserType.splice(index, 1);
      }
    }
    setUserType(selectedUserType);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };
  const changeHandler = (value) => {
    setGeo(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const userValues = {
      name,
      email,
      userType: userType.join(","),
      password,
      selectedRole,
      geo,
    };
    console.log("userValues ===============>", userValues);
    axios
      .post(`${baseUrl}/api/users/register`, userValues)
      .then(() => {
        SuccessToastAlert("User registered successfully!");
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        ErrorToastAlert("Failed to register user. Please try again.");
      });
  };
  const goToHome = () => {
    navigate("/dashboard", {
      state: { user: "Admin" },
    });
  };
  return (
    <div>
      <Navbar />
      <div className="work-area-registration-left">
        <br></br>
        <button className="run-btn" onClick={goToHome}>
          Home
        </button>
        <Subuser />
      </div>
      <div className="work-area-registration">
        <h2>User Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <span class="has-float-label">
                  <label>Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={name}
                    onChange={handleNameChange}
                  />
                </span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            {/* <div className="col-md-4">
              <div className="form-group">
                <label>Select Branch:</label>
                <Select
                  value={selectedBranch}
                  onChange={handleBranchChange}
                  options={branches.map((branch) => ({
                    value: branch.id,
                    label: branch.branch,
                  }))}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Select Department:</label>
                <Select
                  value={selectedDepartment}
                  onChange={setSelectedDepartment}
                  options={departments.map((dept) => ({
                    value: dept.id,
                    label: `${dept.department}`,
                  }))}
                />
              </div>
            </div> */}

            <div className="col-md-4">
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Select Country:</label>
                <Select
                  options={optionsCountryList}
                  className="addCountryListUser"
                  value={geo}
                  onChange={changeHandler}
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>User Type:</label>
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="admin"
                      value="admin"
                      checked={userType.includes("admin")}
                      onChange={handleUserTypeChange}
                    />
                    <label htmlFor="admin" className="form-check-label">
                      Admin
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="user"
                      value="user"
                      checked={userType.includes("user")}
                      onChange={handleUserTypeChange}
                    />
                    <label htmlFor="user" className="form-check-label">
                      User
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {userType.includes("admin") && (
              <div className="col-md-6">
                <div className="form-group">
                  <label>Role:</label>
                  <select
                    className="form-control"
                    id="role"
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="implementer">Implementer</option>
                    <option value="reviewer">Reviewer</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <button type="submit" className="save-btn">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
