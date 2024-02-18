import { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import axios from "axios";
import UserRegistrationForm from "../UserRegistrationForm";
import "./Subuser.css";
import { baseUrl } from "../../config/UrlConfig";
import { Box, Button } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { InfoToastAlert, SuccessToastAlert } from "../Toast";
export default function Subuser() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [columns, setColumns] = useState([]);
  const [showRegistration, setShow] = useState(false);
  useEffect(() => {
    axios.get(`${baseUrl}/api/users/getAllUsers`).then((response) => {
      setUsers(response.data);
      console.log("Users===================>", response.data);
    });
    setColumns([
      { field: "user_name", headerName: "Name", width: 200 },
      { field: "email_id", headerName: "Email", width: 200 },
      { field: "user_Id", headerName: "User ID", width: 200 },

      { field: "role", headerName: "User Type", width: 200 },
      { field: "role_type", headerName: "Role Type", width: 200 },

      {
        field: "",
        headerName: "Actions",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 130,
        renderCell: (params) => (
          <Button className="implement-display-btn" onClick={handleEditBtn}>
            Edit
          </Button>
        ),
      },
    ]);
  }, []);

  const handleEditBtn = (id) => {
    InfoToastAlert("Edit under progress");
    // setUserId(id);
    // setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  return (
    <div className="page-body">
      <Box
        sx={{ height: 300, width: "100%" }}
        style={{
          width: "70vw",
          top: "5vw",
          position: "absolute",
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          rowHeight={38}
          getRowId={(users) => users.id}
          loading={users.length === 0}
          onRowClick={handleEditBtn}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[]}
        />
      </Box>
      {/* <div className="content-area">
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
      </div> */}
      {showRegistration && (
        <div>
          <UserRegistrationForm user={userId} />
        </div>
      )}
    </div>
  );
}
