import "./Dashboard.css";
import userImg from "../../Assets/user-circle-svgrepo-com.svg";
import logout from "../../Assets/logout-exit-svgrepo-com.svg";
import UserRegistrationForm from "../UserRegistrationForm";
import Navbar from "../../Navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import moment from "moment/moment";
import close from "../../Assets/close-circle-svgrepo-com.svg";
import { useLocation, useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const location = useLocation();
  const name = location.state.user;
  console.log(name);
  const [adminValue, setAdminValue] = useState(null);
  const [adminDrop, setAdminDrop] = useState([]);
  const [countInfo, setCountInfo] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [ticketValue, setTicketValue] = useState([]);
  const [userByRole, setUserRole] = useState([]);
  const [placeValue, setPlaceValue] = useState("");
  const [showForward, setShowForward] = useState(false);
  const navigate = useNavigate();
  const adminPlaceHolder = adminValue !== null ? placeValue : "Admin";
  useEffect(() => {
    axios.get(`http://localhost:3100/api/dns/getCount`).then((response) => {
      axios
        .get(
          `http://localhost:3100/api/ticket/getTicketsByUser/${localStorage.getItem(
            "userId"
          )}`
        )
        .then((response) => {
          axios
            .get(`http://localhost:3100/api/users/getUserByRole`)
            .then((response) => {
              setUserRole(response.data);
              console.log("all user by role ======>", response.data);
              setDropDown(response.data);
            });
          console.log("all ticket======>", response.data);
          setUserInfo(response.data);
        });
      console.log("response ===============>", response.data);
      setCountInfo(response.data);
    });
  }, []);
  const handleClose = () => {
    setShowForward(false);
  };
  const setDropDown = (val) => {
    let listOfComponent = [{}];
    for (var j = 0; j < val.length; j++) {
      listOfComponent[j] = {
        value: val[j].id,
        label: val[j].user_name,
      };
    }
    setAdminDrop(listOfComponent);
  };

  const setValueForAdmin = (value) => {
    setPlaceValue(value.label);
    setAdminValue(value.value);
  };
  const handleForwardBtn = (val) => {
    navigate("/display", {
      state: {
        ticket: val,
      },
    });
  };
  const handleCreateRecord = () => {
    navigate("/home");
  };
  const updateTicket = () => {
    const updateValue = {
      forwarded_to: adminValue,
      ticketValue: ticketValue,
      status: "assigned",
    };
    axios
      .post("http://localhost:3100/api/ticket/updateTicket", updateValue)
      .then((response) => {
        console.log(response.data);
      });
  };
  return (
    <div className="page-body">
      <Navbar />
      <div className="content-area">
        <h4>{name}</h4>
        <button className="create-btn" onClick={handleCreateRecord}>
          Create Record
        </button>
        {countInfo && (
          <div className="data-div">
            <div className="count-div">
              <div class="info-item">
                <h1 className="countTag" text-align="center">
                  {countInfo.create}
                </h1>
                <h6 className="countLabel">Create</h6>
              </div>
            </div>
            <div className="count-div">
              <div class="info-item">
                <h1 className="countTag" text-align="center">
                  {countInfo.modify}
                </h1>
                <h6 className="countLabel">Modify</h6>
              </div>
            </div>
            <div className="count-div">
              <div class="info-item">
                <h1 className="countTag" text-align="center">
                  {countInfo.delete}
                </h1>
                <h6 className="countLabel">Delete</h6>
              </div>
            </div>
          </div>
        )}

        <div className="display-div">
          <div className="data-display">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Req_date</th>
                  <th>Req_id</th>
                  <th>Status</th>
                  <th>Environment</th>
                  <th>Ageing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userInfo.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {user.createdAt
                        ? moment(user.createdAt).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td>{user.ticket_id}</td>
                    <td>{user.ticket_status ? user.ticket_status : ""}</td>
                    <td>prod</td>
                    <td>
                      {user.createdAt
                        ? Math.ceil(
                            Math.abs(
                              new Date() -
                                moment(user.createdAt).format("DD-MMM-YYYY")
                            ) /
                              (1000 * 3600 * 24)
                          )
                        : ""}
                    </td>

                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleForwardBtn(user.ticket_id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showForward && (
        <div className="forwardDiv">
          <div className="drop-down-div">
            <img
              src={close}
              alt=""
              className="close-btn"
              onClick={handleClose}
            ></img>
            <input type="text" value={ticketValue} className="ticket-box" />
            <h1></h1>
            <Select
              options={adminDrop}
              placeholder={adminPlaceHolder}
              value={adminValue}
              onChange={setValueForAdmin}
              isRequired
            ></Select>
            <h1></h1>
            <button className="update-btn-primary" onClick={updateTicket}>
              {" "}
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
