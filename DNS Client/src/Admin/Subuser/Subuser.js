import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "axios";
import UserRegistrationForm from "../UserRegistrationForm";
import "./Subuser.css";
import { baseUrl } from "../../config/UrlConfig";
export default function Subuser() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [showRegistration, setShow] = useState(false);
  useEffect(() => {
    axios.get(`${baseUrl}/api/users/getAllUsers`).then((response) => {
      setUsers(response.data);
      console.log("Users===================>", response.data);
    });
  }, []);

  const handleEditBtn = (id) => {
    setUserId(id);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  return (
    <div className="page-body">
      <Navbar />
      <div className="content-area">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User ID</th>
              <th>Department</th>
              <th>User Type</th>
              <th>Role Type</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.user_name}</td>
                <td>{user.email_id}</td>
                <td>{user.user_Id}</td>
                <td>{user.department}</td>
                <td>{user.role}</td>
                <td>{user.role_type}</td>
                <td>
                  <button className="btn btn-primary btn-sm">Delete</button>
                  {/* onClick={() => handleDelete(user.user_Id)} */}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEditBtn(user.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showRegistration && (
        <div className="registration-form">
          <button onClick={handleClose}>close</button>

          <UserRegistrationForm user={userId} />
        </div>
      )}
    </div>
  );
}
