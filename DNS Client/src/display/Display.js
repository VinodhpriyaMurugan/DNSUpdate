import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { JsonToTable } from "react-json-to-table";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./display.css";
import Navbar from "../Navbar/Navbar";
import { Box, Checkbox, Modal } from "@material-ui/core";
import { DataGrid, GridCheckboxSelectionModel } from "@mui/x-data-grid";
import moment from "moment";
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
  const navigate = useNavigate();
  const runDns = (id) => {
    console.log("Run Dns Id", id);
    // ${process.env.REACT_APP_BASE_URL}/api/dns/runDNSByCSV
    axios
      .get(`http://localhost:3100/api/dns/runDNSByCSV`, { params: { id: id } })
      .then((response) => {
        console.log(response);
        // Handle data
        setOutput(response.data);
      });
  };
  useEffect(() => {
    console.log("inside use effect");
    const fetchData = async () => {
      let allResponse = await axios.get(
        `http://localhost:3100/api/dns/getDnsRecord/${ticket}`
      );
      let response = await axios.get(
        `http://localhost:3100/api/dns/getCreateActionDnsRecord`
      );
      // let record = await axios.get(`http://localhost:3100/api/dns/getRecord`)
      // let deleteResponse = await axios.get(
      //   `http://localhost:3100/api/dns/getDeleteActionDnsRecord`
      // );
      // let modifyResponse = await axios.get(
      //   `http://localhost:3100/api/dns/getModifyActionDnsRecord`
      // );
      // console.log(response.data);
      // console.log(deleteResponse.data);
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
    fetchData();
  }, []);
  const handleRowClick = async (params) => {
    console.log(params.row.id);
    let value = await axios.get(
      `http://localhost:3100/api/dns/getDnsRecordById/${params.row.id}`
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
    console.log("Approve value============>", value);
    let approveValue = {
      status: "Approved",
      id: value,
      date: moment(scheduledDate).format("DD-MMM-YYYY"),
    };
    let result = await axios.post(
      "http://localhost:3100/api/dns/updateDnsRecord",
      approveValue
    );
    if (result) {
      setBtnValue("Approved");
      setShow("block");
      setReject("none");
    }

    console.log("result from backend=====>", result);
  };
  const handleReject = async (value) => {
    console.log("Approve value============>", value);
    let approveValue = {
      status: "Rejected",
      id: value,
      date: moment(scheduledDate).format("DD-MMM-YYYY"),
    };
    let result = await axios.post(
      "http://localhost:3100/api/dns/updateDnsRecord",
      approveValue
    );
    setShow("none");
    setReject("block");
    setOpen(true);
  };
  const handleRun = () => {
    axios
      .get(`http://localhost:3100/api/dns/runDNSByCSV`, {
        params: { id: viewRecord.id },
      })
      .then((response) => {
        console.log(response);
        // Handle data
        // setOutput(response.data);
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
      {/* {jsonTableArrayData && (
        <table className="displayTable">
          <thead>
            <tr>
              {tableToDisplay.map((header) => (
                <th key={header}>{header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jsonTableArrayData.map((obj) => (
              <tr key={obj.id}>
                {tableToDisplay.map((header) => (
                  <td key={header}>{obj[header]}</td>
                ))}
                <td>
                  <Button
                    key={obj.id}
                    onClick={(e) => {
                      e.preventDefault();
                      runDns(obj.id);
                    }}
                  >
                    Run
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )} */}

      <div className="work-area-implement">
        <button className="run-btn" onClick={goToHome}>
          Home
        </button>
        {jsonTableArrayData.length === 0 ? (
          <h6>No data found</h6>
        ) : (
          <Box sx={{ height: 300, width: "100%" }}>
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
          //  <div className="btn-area">

          //   </div>
        )}
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
                  <p>
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
                  </p>
                  {/* Add more fields as needed */}
                </div>
              </div>
            )}
            {!viewRecord && <p>No record selected.</p>}
            <div className="value-div">
              {/* <input
                type="date"
                className="dateTypeDiv"
                value={scheduledDate || ""}
                onChange={(e) => {
                  setScheduledDate(e.target.value);
                }}
              /> */}
              {showDate && (
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
              )}
              {reschedule && (
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
              )}
              <Button
                className="implement-display-btn"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              {!reschedule && (
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
                onClick={() => handleReject(viewRecord.id)}
                style={{ display: reject }}
              >
                {viewRecord.status === "Approved" ? "Run" : "Reject"}
              </Button>
              <Button
                className="implement-display-btn"
                onClick={handleRun}
                style={{ display: show }}
              >
                Run
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}