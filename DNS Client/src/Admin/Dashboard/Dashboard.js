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
export default function Dashboard() {
  const location = useLocation();
  const name = location.state.user;
  console.log(name);
  const navigate = useNavigate();
  const [adminValue, setAdminValue] = useState(null);
  const [adminDrop, setAdminDrop] = useState([]);
  const [countInfo, setCountInfo] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [ticketValue, setTicketValue] = useState([]);
  const [userByRole, setUserRole] = useState([]);
  const [placeValue, setPlaceValue] = useState("");
  const [showForward, setShowForward] = useState(false);
  const [searchUserInfo, setSearchUserInfo] = useState([]);
  const [showAdmin, setShowAdmin] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const adminPlaceHolder = adminValue !== null ? placeValue : "Admin";
  useEffect(() => {
    axios.get(`http://localhost:3100/api/dns/getCount`).then((response) => {
      axios
        .get(`http://localhost:3100/api/ticket/getTickets`)
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
      console.log("count ===============>", response.data);
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
    setTicketValue(val);
    setShowForward(true);
  };
  const handleViewBtn = (val) => {
    alert(val);
    navigate("/display", {
      state: {
        ticket: val,
      },
    });
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
  const handleImplementBtn = () => {
    navigate("/implement");
  };
  const handleCreateRecord = () => {
    navigate("/home");
  };
  const handleSearch = (e) => {
    console.log(e);
    if (e) {
      setShowAdmin(false);
      setShowSearch(true);
      axios
        .get(`http://localhost:3100/api/ticket/searchByTicket/${e}`)
        .then((response) => {
          console.log("Search response ==>", response.data.details);
          setSearchUserInfo(response.data.details);
        });
    } else {
      setShowAdmin(true);
      setShowSearch(false);
    }
  };
  return (
    <div className="page-body">
      <Navbar />
      <div className="top-content-area">
        <div className="top-content-div">
          <div className="name-div">
            <h4>{name}</h4>
            <button
              className="create-btn"
              onClick={handleCreateRecord}
              style={{ color: "black", fontWeight: "bolder" }}
            >
              Create Record
            </button>
          </div>
          <input
            type="text"
            placeholder="search"
            className="search-btn"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {/* <button className="implement-btn" onClick={handleImplementBtn}>
            Implement by category
          </button> */}
        </div>
      </div>
      <div className="content-area">
        {countInfo && (
          <div className="data-div">
            <div className="count-div">
              <div class="info-item">
                <h1 className="countTag" text-align="center">
                  {countInfo.total}
                </h1>
                <h6 className="countLabel">Tickets</h6>
              </div>
            </div>
            <div className="count-div">
              <div class="info-item">
                <h1 className="countTag" text-align="center">
                  {countInfo.approved}
                </h1>
                <h6 className="countLabel">Approved</h6>
              </div>
            </div>
            <div className="count-div">
              <div class="info-item">
                <h1 className="countTag" text-align="center">
                  {countInfo.pending}
                </h1>
                <h6 className="countLabel">Pending</h6>
              </div>
            </div>
            <div className="count-div">
              <div class="info-item">
                <h1 className="countTag" text-align="center">
                  {countInfo.scheduled}
                </h1>
                <h6 className="countLabel">Scheduled</h6>
              </div>
            </div>
          </div>
        )}

        <div className="display-div">
          <div className="data-display">
            {showAdmin && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Req_date</th>
                    <th>Req_id</th>
                    <th>Requested_user</th>

                    <th >Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userInfo.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.user.createdAt}</td>
                      <td>{user.ticket_id}</td>
                      <td>{user.user.user_name}</td>

                      {/* <td>
                        {user.user.createdAt
                          ? Math.ceil(
                              Math.abs(
                                new Date() -
                                  moment(user.user.createdAt).format(
                                    "DD-MMM-YYYY"
                                  )
                              ) /
                                (1000 * 3600 * 24)
                            )
                          : ""}
                      </td> */}
                      {/* <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleForwardBtn(user.ticket_id)}
                        >
                          Forward
                        </button>
                      </td> */}
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewBtn(user.ticket_id)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {showSearch && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Req_date</th>
                    <th>Req_id</th>
                    <th>Requested_user</th>
                    <th>Dns type</th>
                    <th>Action</th>
                    <th>Dns Record type</th>
                    <th>Status</th>
                    <th>Scheduled on</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchUserInfo.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {user.createdAt
                          ? moment(user.user.createdAt).format("DD-MMM-YYYY")
                          : ""}
                      </td>
                      <td>{user.ticket_id}</td>
                      <td>{user.user}</td>
                      <td>{user.dns_type}</td>
                      <td>{user.action}</td>
                      <td>{user.dns_record_type}</td>
                      <td>{user.status ? user.status : "Not assigned"}</td>
                      <td>
                        {user.scheduled_on
                          ? moment(user.scheduled_on).format("DD-MMM-YYYY")
                          : ""}
                      </td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewBtn(user.ticket_id)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
              Assign{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
