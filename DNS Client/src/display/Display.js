import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { JsonToTable } from "react-json-to-table";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./display.css";
import Navbar from "../Navbar/Navbar";
import {
  Box,
  Checkbox,
  Grid,
  Icon,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  DataGrid,
  GridCheckboxSelectionModel,
  GridCloseIcon,
} from "@mui/x-data-grid";
import moment from "moment";
import { ErrorToastAlert, SuccessToastAlert } from "../Admin/Toast";
import { baseUrl } from "../config/UrlConfig";
export default function Display() {
  const location = useLocation();
  const ticket = location.state.ticket;
  const [jsonTableArrayData, setJsonTableData] = useState([]);
  const [tableToDisplay, setTableDataToDisplay] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(true);
  const [outPutToDisplay, setOutput] = useState("");
  const [viewRecord, setViewedRecord] = useState([]);
  const [show, setShow] = useState("none");
  const [reject, setReject] = useState("block");
  const [btnValue, setBtnValue] = useState("Approve");
  const [scheduledDate, setScheduledDate] = useState("");
  const [showDate, setShowDate] = useState(true);
  const [scheduleTag, setScheduleTag] = useState("Schedule on");
  const [reschedule, setReschedule] = useState(false);
  const [showRemarks, setShowRemarks] = useState(true);
  const [remarks, setRemarks] = useState("");
  const navigate = useNavigate();
  const runDns = (id) => {
    console.log("Run Dns Id", id);
    // ${process.env.REACT_APP_BASE_URL}/api/dns/runDNSByCSV
    axios
      .get(`${baseUrl}/api/dns/runDNSByCSV`, { params: { id: id } })
      .then((response) => {
        console.log(response);
        // Handle data
        setOutput(response.data);
      });
  };
  useEffect(() => {
    console.log("inside use effect");

    fetchData();
  }, []);
  const fetchData = async () => {
    let allResponse = await axios.get(
      `${baseUrl}/api/dns/getDnsRecord/${ticket}`
    );
    let response = await axios.get(
      `${baseUrl}/api/dns/getCreateActionDnsRecord`
    );

    console.log("allResponse.data", allResponse.data);
    setJsonTableData(allResponse.data);

    setRows(allResponse.data);

    setColumns([
      { field: "id", headerName: "ID", width: 50 },
      { field: "dns_type", headerName: "DNS_TYPE" },
      { field: "action", headerName: "Action" },
      { field: "zone_name", headerName: "Zone Name" },
      { field: "service_tier", headerName: "Service Tier" },
      { field: "testing_mode", headerName: "Testing Mode" },
      { field: "ticket_id", headerName: "Ticket_id" },
      { field: "user", headerName: "Created By" },
      { field: "dns_name", headerName: "R Status" },
      {
        field: "",
        headerName: "Actions",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 130,
        renderCell: (params) => (
          <Button className="implement-display-btn" onClick={handleRowClick}>
            View
          </Button>
          // <Button
          //   src={downloadBtn}
          //   alt="Unable to Fetch Link"
          //   style={{ height: "20%", width: "20%" }}
          // />
        ),
      },
    ]);
    // const headers = Object.keys(response.data[0]);
    // setTableDataToDisplay(headers);
    // console.log(headers);
  };
  const handleRowClick = async (params) => {
    let value = await axios.get(
      `${baseUrl}/api/dns/getDnsRecordById/${params.row.id}`
    );
    setViewedRecord(value.data[0]);
    if (value.data[0].scheduled_on) {
      setShowDate(false);
    }
    if (
      !(
        moment(value.data[0].scheduled_on).format("YYYY-MM-DD") >
        moment(new Date()).format("YYYY-MM-DD")
      )
    ) {
      setReschedule(true);

      console.log(
        "check for reschedule",
        moment(value.data[0].scheduled_on).format("YYYY-MM-DD"),
        moment(new Date()).format("YYYY-MM-DD"),
        moment(value.data[0].scheduled_on).format("YYYY-MM-DD") >
          moment(new Date()).format("YYYY-MM-DD")
      );
    }
    console.log("fetched Record====>", value.data[0]);
    setSelectedRow(params.row);
    setOpen(false);
  };
  const handleCloseModal = () => {
    setBtnValue("Approve");
    setOpen(true);
  };
  const handleApprove = async (value) => {
    console.log(
      "Approve value============>",
      moment(scheduledDate).format("DD-MMM-YYYY")
    );
    if (moment(scheduledDate).format("DD-MMM-YYYY") != "Invalid date") {
      let approveValue = {
        status: "Approved",
        id: value,
        date:
          moment(scheduledDate).format("DD-MMM-YYYY") != "Invalid date"
            ? moment(scheduledDate).format("DD-MMM-YYYY")
            : null,
      };
      let result = await axios.post(
        `${baseUrl}/api/dns/updateDnsRecord`,
        approveValue
      );
      if (result) {
        SuccessToastAlert("Status approved");
        setBtnValue("Approved");
        setShow("block");
        setReject("none");
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      }
    } else {
      ErrorToastAlert("Kindly schedule the date and approve");
    }
  };
  const updateTicketStatus = async (value) => {
    console.log(ticket);
    try {
      let ticketStatus = {
        status: value,
        remarks: remarks,
        id: viewRecord.ticket_id,
      };
      if (value === "Rejected") {
        setShowRemarks(false);
      } else {
        let result = await axios.post(`${baseUrl}/api/dns/updateticketStatus`, {
          id: ticket,
          remarks: remarks,
          status: value,
        });

        if (result.status == 200) {
          SuccessToastAlert("Status Updated");
          setShowRemarks(true);
          fetchData();
        }
      }
    } catch (error) {
      ErrorToastAlert("Error updating status");
    }
  };
  const handleReject = async (value, info) => {
    if (info === "Run") {
      handleRun();
    } else {
      console.log("Approve value============>", value);

      let approveValue = {
        status: "Rejected",
        id: value,
        date:
          moment(scheduledDate).format("DD-MMM-YYYY") != "Invalid date"
            ? moment(scheduledDate).format("DD-MMM-YYYY")
            : null,
      };
      let result = await axios.post(
        `${baseUrl}/api/dns/updateDnsRecord`,
        approveValue
      );
      console.log("result==>", result);
    }

    setShow("none");
    setReject("block");
    setOpen(true);
  };
  const handleAllRun = () => {
    axios
      .get(`${baseUrl}/api/dns/runDNSByCSV`, {
        params: { id: ticket },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        ErrorToastAlert("Script running failed");
        console.error("Error occurred:", error);
      });
  };
  const handleRun = () => {
    console.log(viewRecord);
    axios
      .get(`${baseUrl}/api/dns/runDNSByCSV`, {
        params: { id: viewRecord.ticket_id },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        ErrorToastAlert("Script running failed");
        console.error("Error occurred:", error);
      });
  };
  const goToHome = () => {
    navigate("/dashboard", {
      state: { user: "Admin" },
    });
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    width: "50vw",
    height: "99vh",
    left: "58vw",
  };
  return (
    <div>
      <Navbar />

      {rows.length > 0 && (
        <div className="work-area-implement">
          <button className="run-btn" onClick={goToHome}>
            Home
          </button>
          {jsonTableArrayData.length === 0 ? (
            <h6>No data found</h6>
          ) : (
            <Box
              sx={{ height: 300, width: "100%" }}
              style={{
                width: "70vw",
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                rowHeight={38}
                getRowId={(row) => row.id}
                loading={rows.length === 0}
                onRowClick={handleRowClick}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[]}
              />
            </Box>
          )}
          <Button onClick={handleAllRun}>Run</Button> &nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            style={{
              background:
                (rows.length && rows[0].status) === "Approved"
                  ? "#c3baba"
                  : "#0d6efd",
              border: "none",
            }}
            disabled={rows[0].status === "Approved"}
            onClick={() => {
              updateTicketStatus("Approved");
            }}
          >
            {rows.length && rows[0].status === "Approved"
              ? "Approved"
              : "Approve"}
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {showRemarks && (
            <Button
              onClick={() => {
                updateTicketStatus("Rejected");
              }}
            >
              Reject
            </Button>
          )}
          <br></br>
          <div style={{ display: "flex" }}>
            {!showRemarks && (
              <>
                <TextField
                  // className="remarks"
                  id="standard-basic"
                  label="Remarks"
                  variant="standard"
                  onChange={(e) => setRemarks(e.target.value)}
                  focused
                />
                <br></br>
                <Button
                  onClick={() => {
                    updateTicketStatus("Reject");
                  }}
                >
                  Update
                </Button>
              </>
            )}
          </div>
          <div className="modal-div" hidden={open}>
            <div className="viewDiv">
              <h4 className="ticketTag">
                {viewRecord.ticket_id}
                <button className="viewTag-btn">{viewRecord.user}</button>
                <button className="viewTag-btn">
                  {viewRecord.dns_record_type}
                </button>
              </h4>

              {viewRecord && (
                <div>
                  <div className="value-div">
                    <p className="viewValue">
                      {viewRecord.dns_type || "NA"}
                      <h4 className="viewTags">DNS Type:</h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.action || "NA"}
                      <h4 className="viewTags">Action:</h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.c_name || "NA"}
                      <h4 className="viewTags">c_name:</h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.dns_record_type || "NA"}
                      <h4 className="viewTags">DNS Record Type:</h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.date || "NA"}
                      <h4 className="viewTags">Date: </h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.dns_name || "NA"}
                      <h4 className="viewTags">DNS Name:</h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.service_tier || "NA"}
                      <h4 className="viewTags">Service Tier:</h4>{" "}
                    </p>
                    <p className="viewValue">
                      {viewRecord.testing_mode || "NA"}
                      <h4 className="viewTags">Testing Mode:</h4>{" "}
                    </p>

                    {/* Add more fields as needed */}
                  </div>
                  <div className="value-div">
                    <p className="viewValue">
                      {viewRecord.ip_address || "NA"}
                      <h4 className="viewTags">Ip Address:</h4>{" "}
                    </p>
                    <p className="viewValue">
                      {viewRecord.port_no || "NA"}
                      <h4 className="viewTags">Port No: </h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.priority || "NA"}
                      <h4 className="viewTags">Priority: </h4>{" "}
                    </p>
                    <p className="viewValue">
                      {viewRecord.protocol || "NA"}
                      <h4 className="viewTags">Protocol:</h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.service || "NA"}
                      <h4 className="viewTags">Service: </h4>
                    </p>
                    <p className="viewValue">
                      {viewRecord.fqdn_name || "NA"}
                      <h4 className="viewTags">FQDN Name:</h4>
                    </p>
                    {/* <p>
                    {!showDate && (
                      <div className="dateTypeDiv">
                        <p className="viewValue">
                          {moment(viewRecord.scheduled_on).format(
                            "DD-MMM-YYYY"
                          ) || "NA"}
                          <h4 className="viewTags">Scheduled On</h4>
                        </p>
                      </div>
                    )}
                  </p> */}
                  </div>
                </div>
              )}
              {!viewRecord && <p>No record selected.</p>}
              <div className="value-div">
                {showDate && (
                  <></>
                  // <div className="dateTypeDiv">
                  //   <input
                  //     type="date"
                  //     className="dateInput"
                  //     value={scheduledDate}
                  //     onChange={(e) => {
                  //       setScheduledDate(e.target.value);
                  //     }}
                  //   />
                  //   {!scheduledDate && (
                  //     <span className="placeholder">{scheduleTag}</span>
                  //   )}
                  // </div>
                )}
                {/* {reschedule && (
                <div className="dateTypeDiv">
                  <input
                    type="date"
                    className="dateInput"
                    value={scheduledDate}
                    onChange={(e) => {
                      setScheduledDate(e.target.value);
                    }}
                  />
                  {!scheduledDate && (
                    <span className="placeholder">{scheduleTag}</span>
                  )}
                </div>
              )} */}
                <Button
                  className="implement-display-btn"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
                {/* {!reschedule && (
                <Button
                  className="implement-display-btn"
                  onClick={() => handleApprove(viewRecord.id)}
                >
                  {viewRecord.status === "Approved" ? "Approved" : btnValue}
                </Button>
              )}
              {reschedule && (
                <Button
                  className="implement-display-btn"
                  onClick={() => handleApprove(viewRecord.id)}
                >
                  {viewRecord.status === "Approved" ? "Update" : btnValue}
                </Button>
              )}

              <Button
                className="implement-display-btn"
                onClick={() =>
                  handleReject(
                    viewRecord.id,
                    viewRecord.status === "Approved" ? "Run" : "Reject"
                  )
                }
                style={{ display: reject }}
              >
                {viewRecord.status === "Approved" ? "Run" : "Reject"}
              </Button> */}
                <Button
                  className="implement-display-btn"
                  onClick={() => {
                    handleRun();
                  }}
                  style={{ display: show }}
                >
                  Run
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        {rows.length == 0 && (
          <h6
            style={{
              position: "absolute",
              left: "49vw",
              top: "15vh",
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "25px",
            }}
          >
            No data found
          </h6>
        )}
      </div>
    </div>
  );
}
