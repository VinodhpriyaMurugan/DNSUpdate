import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./display.css";
import { Box } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
export default function ApprovedTickets() {
  const [rows, setRows] = useState([]);
  const [rowUnscheduled, setRowsUnscheduled] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [jsonTableArrayData, setJsonTableData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("inside use effect");
    const fetchData = async () => {
      let allResponse = await axios.get(
        `http://localhost:3100/api/dns/getApprovedDnsRecordByUser/${localStorage.getItem(
          "userLoggedIn"
        )}`
      );
      console.log("allResponse", allResponse);

      setRows(allResponse.data);

      setColumns([
        { field: "id", headerName: "ID", width: 50 },
        { field: "dns_type", headerName: "DNS_TYPE", width: 150 },
        { field: "scheduled_on", headerName: "Scheduled", width: 150 },
        { field: "status", headerName: "Status", width: 200 },
        { field: "action", headerName: "Action", width: 150 },
        { field: "zone_name", headerName: "Zone Name", width: 200 },
        { field: "service_tier", headerName: "Service Tier", width: 200 },
        { field: "testing_mode", headerName: "Testing Mode", width: 200 },
        { field: "ticket_id", headerName: "Ticket_id", width: 200 },
        { field: "user", headerName: "Created By", width: 200 },

        ,
      ]);
      console.log("all response============>", allResponse);
      setJsonTableData(allResponse.data);
    };
    fetchData();
  }, []);
  const gotoHome = () => {
    navigate("/dashboard", {
      state: { user: "admin" },
    });
  };
  return (
    <div>
      <button onClick={gotoHome} className="run-btn">
        Home
      </button>
      <h4>Approved Records</h4>
      {rows.length === 0 ? (
        <h6>No data found</h6>
      ) : (
        <Box sx={{ height: 300, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={38}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[]}
          />
        </Box>
      )}
    </div>
  );
}
