import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { JsonToTable } from "react-json-to-table";
import { json, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./display.css";
import { Box, Checkbox, Tab, Tabs } from "@material-ui/core";
import { DataGrid, GridCheckboxSelectionModel } from "@mui/x-data-grid";
import { baseUrl } from "../config/UrlConfig";
export default function DisplayByDns(props) {
  const { value } = props;
  const [rows, setRows] = useState([]);
  const [rowUnscheduled, setRowsUnscheduled] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };
  // const handleCheckboxChange = (event, id) => {
  //   const checked = event.target.checked;
  //   if (checked) {
  //     setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
  //   } else {
  //     setSelectedRows((prevSelectedRows) =>
  //       prevSelectedRows.filter((rowId) => rowId !== id)
  //     );
  //   }
  // };
  const handleCheckboxChange = (event) => {
    const checkedRows = event.selectionModel;
    setSelectedRows(checkedRows);
  };
  const handleHeaderCheckboxChange = (event) => {
    const checked = event.target.checked;
    if (checked) {
      const newSelectedRows = jsonTableArrayData.map((item) => item.id);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };
  console.log(value, "props========>");
  const [jsonTableArrayData, setJsonTableData] = useState([]);
  const [tableToDisplay, setTableDataToDisplay] = useState([]);
  const [outPutToDisplay, setOutput] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const runDns = (id) => {
    console.log("Run Dns Id", selectedRows);

    axios
      .get(`${baseUrl}/api/dns/runDNSByCSV`, { params: { id: id } })
      .then((response) => {
        console.log(response);
        // Handle data
        setOutput(response.data);
      });
  };
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    console.log("inside use effect");
    const fetchData = async () => {
      let allResponse = await axios.get(
        `${baseUrl}api/dns/getDnsRecordByType/${value}`
      );
      console.log("allResponse", allResponse);
      let unscheduled = await axios.get(
        `${baseUrl}api/dns/getTypeUnscheduled/${value}`
      );
      console.log(
        "unscheduled",
        unscheduled.data,
        allResponse.data.length,
        unscheduled.data.length
      );
      setRows(allResponse.data);
      setRowsUnscheduled(unscheduled.data);
      setColumns([
        { field: "id", headerName: "ID", width: 50 },
        { field: "dns_type", headerName: "DNS_TYPE", width: 150 },
        { field: "scheduled_on", headerName: "Scheduled", width: 150 },
        { field: "action", headerName: "Action", width: 150 },
        { field: "zone_name", headerName: "Zone Name", width: 200 },
        { field: "service_tier", headerName: "Service Tier", width: 200 },
        { field: "testing_mode", headerName: "Testing Mode", width: 200 },
        { field: "ticket_id", headerName: "Ticket_id", width: 200 },
        { field: "user", headerName: "Created By", width: 200 },
        // {
        //   field: "checkbox",
        //   headerName: "Checkbox",
        //   renderCell: (params) => (
        //     <Checkbox
        //       color="primary"
        //       checked={selectedRows.includes(params.row.id)}
        //       onChange={(event) => handleCheckboxChange(event, params.row.id)}
        //     />
        //   ),
        //   headerCheckboxSelection: true,
        //   headerCheckboxSelectionProps: {
        //     onChange: handleHeaderCheckboxChange,
        //   },
        //   width: 100,
        // },
        //   { field: "user", headerName: "Created By", width: 200,
        //  },
        ,
      ]);
      console.log("all response============>", allResponse);
      setJsonTableData(allResponse.data);
      // const headers = Object.keys(allResponse.data[0]);
      // setTableDataToDisplay(headers);
      // console.log(headers);
    };
    fetchData();
  }, [value]);
  const handleImplementation = () => {
    console.log("runDns=======>", selectedRows);
    console.log("jsonTableArrayData=========>", jsonTableArrayData);
    selectedRows.forEach((value) => {
      console.log(value);
      axios
        .get(`${baseUrl}api/dns/runDNSByCSV`, {
          params: { id: value },
        })
        .then((response) => {
          console.log(response);
          // Handle data
          setOutput(response.data);
        });
    });
  };
  const handleSelectionModelChange = (selectionModel) => {
    alert("clicked me");
    setSelectedRows(selectionModel);
  };
  const setDate = async (value) => {
    let allResponse = await axios.get(
      `${baseUrl}api/dns/getDnsRecordByDate/${value}`
    );
    setRows(allResponse.data);
    console.log("Date values fetched", allResponse.data);
  };
  return (
    <div>
      <h4>
        {value} Records {rows.length}/{rowUnscheduled.length}
      </h4>
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <div>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Scheduled" />
          <Tab label="Not Scheduled" />
        </Tabs>
      </div>
      {selectedTab === 0 &&
        (rows.length === 0 ? (
          <h6>No data found</h6>
        ) : (
          <Box sx={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              rowHeight={38}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              checkboxSelection
              // onSelectionModelChange={handleSelectionModelChange}
              // selectionModel={selectedRows}
              // onSelectionModelChange={(newSelection) => {
              //   setSelectedRows(newSelection.selectionModel);
              // }}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedRows(newRowSelectionModel);
              }}
              rowSelectionModel={selectedRows}
              // loading={rows.length === 0}
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
        ))}

      {selectedTab === 1 &&
        (rowUnscheduled.length === 0 ? (
          <h6>No data found</h6>
        ) : (
          <Box sx={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={rowUnscheduled}
              columns={columns}
              rowHeight={38}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
              checkboxSelection
              // onSelectionModelChange={handleSelectionModelChange}
              // selectionModel={selectedRows}
              // onSelectionModelChange={(newSelection) => {
              //   setSelectedRows(newSelection.selectionModel);
              // }}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedRows(newRowSelectionModel);
              }}
              rowSelectionModel={selectedRows}
              // loading={rows.length === 0}
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
        ))}
      <button className="run-btn" onClick={handleImplementation}>
        Run
      </button>
      {/* {jsonTableArrayData.length === 0 ? (
        ""
      ) : (
       
      )} */}
    </div>
  );
}
