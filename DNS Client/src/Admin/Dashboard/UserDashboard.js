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
import ApprovedTickets from "../../display/ApprovedTickets";
import { baseUrl } from "../../config/UrlConfig";
export default function UserDashboard() {
  const location = useLocation();
  // const name = location.state.user.toUpperCase();
  // const branch = location.state.branch;
  // const dept = location.state.dept;
  const show = location.state.value;

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
    axios
      .get(
        `${baseUrl}/api/dns/getCountById/${localStorage.getItem(
          "userLoggedIn"
        )}`
      )
      .then((response) => {
        axios
          .get(
            `${baseUrl}/api/ticket/getUserTicket/${localStorage.getItem(
              "userId"
            )}`
          )
          .then((response) => {
            console.log("all ticket======>", response.data);
            setUserInfo(response.data);
            checkValue(response.data);
          });
        console.log("response ===============>", response.data);
        setCountInfo(response.data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);
  const checkValue = (value) => {
    console.log("value========>", value);
  };
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
      .post(`${baseUrl}/api/ticket/updateTicket`, updateValue)
      .then((response) => {
        console.log(response.data);
      });
  };
  return (
    <div className="page-body">
      <Navbar />
      <div className="content-area-user">
        <div className="nameTag">
          <h1>{localStorage.getItem("user").toUpperCase()}</h1>
          <h6>
            {localStorage.getItem("branch")}/{localStorage.getItem("dept")}
          </h6>
        </div>

        {/* <button className="create-btn" onClick={handleCreateRecord}>
          Create Record
        </button> */}
        {!show && countInfo && (
          <div className="data-div">
            <div className="count-div">
              <div class="info-item">
                <h1 className="countTag" text-align="center">
                  {countInfo.total}
                </h1>
                <h6 className="countLabel">Total</h6>
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
          </div>
        )}
        {!show && (
          <div className="display-div">
            <div className="data-display">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Req_date</th>
                    <th>Ticket_id</th>
                    <th>DNS Type</th>
                    <th>Record Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userInfo.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {moment(user.ticket.createdAt).format("DD-MMM-YYYY")}
                      </td>
                      <td>{user.ticket.ticket_id}</td>
                      <td>{user.details.dns_type}</td>
                      <td>{user.details.dns_record_type}</td>
                      <td>{user.ticket.ticket_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="content-area-user-approved">
        {show && (
          <div className="display-div-approved">
            <ApprovedTickets />
          </div>
        )}
      </div>
    </div>
  );
}
