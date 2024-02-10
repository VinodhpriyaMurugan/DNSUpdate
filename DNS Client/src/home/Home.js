import React, { useState } from "react";
import { Alert, AlertTitle, Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./home.css";
import { MenuItem, Modal } from "@material-ui/core";

const Home = () => {
  const navigate = useNavigate();
  const [repeatCount, setRepeatCount] = useState(0);
  const [createCount, setCreateCount] = useState(0);
  const [modifyCount, setModifyCount] = useState(0);
  const [deleteCount, setDeleteCount] = useState(0);
  const [dnsTypes, setDnsTypes] = useState(["Internal"]);
  const [actions, setActions] = useState(["Create"]);
  const [serviceTier, setServiceTier] = useState(["Production"]);
  const [testing, setTesting] = useState(["bvt"]);
  const [dnsRecordTypes, setDnsRecordTypes] = useState(["A"]);
  const [zoneNames, setZoneNames] = useState([""]);
  const [dnsNames, setDnsNames] = useState([""]);
  const [ttl, setTTL] = useState([""]);
  const [ipAddresses, setIpAddresses] = useState([""]);
  const [fqdnName, setFqdnName] = useState([""]);
  const [cNames, setCNames] = useState([""]);
  const [service, setService] = useState([""]);
  const [protocol, setProtocol] = useState([""]);
  const [port, setPort] = useState([""]);
  const [priority, setPriority] = useState([""]);
  const [weight, setWeight] = useState([""]);
  const [validated, setValidated] = useState(false);
  const [formVal, setFormVal] = useState([]);
  const [file, setFile] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [tId, setTid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  function generateRandomString(length, val) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = val;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  const generateTicketId = () => {
    return generateRandomString(4, "TI");
  };

  // const onFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };

  const uploadFile = async (value) => {
    alert("upload file==>");
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("ticket", value);
    formData.append("id", localStorage.getItem("userId"));
    formData.append("ticket_status", "Pending");
    console.log("====================================");
    console.log("Form data=======>", formData);
    console.log("====================================");
    await axios
      .post("http://localhost:3100/api/ticket/saveTickets", formData)
      .then((Response) => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          navigate("/dashboard", {
            state: {
              user: "admin",
            },
          });
        }, 2000);

        console.log("File upload response ======>", Response.data);
      });
  };
  const handleFormSubmit = async (event) => {
    var ticketId = generateTicketId();
    console.log("ticketId", ticketId);
    setTid(ticketId);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      // Submit form data to the server
      const formData = {
        dnsTypes,
        actions,
        dnsRecordTypes,
        zoneNames,
        dnsNames,
        ipAddresses,
        cNames,
        service,
        protocol,
        weight,
        priority,
        port,
      };
      let finalValue = [];
      for (var i = 0; i < repeatCount; i++) {
        // generateTicketId(actions[i]);
        if (weight[i] === undefined) {
          const newWeight = [...weight];
          newWeight[i] = "";
          setWeight(newWeight);
        }
        if (port[i] === undefined) {
          const newWeight = [...port];
          newWeight[i] = "";
          setPort(newWeight);
        }
        if (cNames[i] === undefined) {
          const newWeight = [...cNames];
          newWeight[i] = "";
          setCNames(newWeight);
        }
        if (service[i] === undefined) {
          const newWeight = [...service];
          newWeight[i] = "";
          setService(newWeight);
        }
        if (protocol[i] === undefined) {
          const newWeight = [...protocol];
          newWeight[i] = "";
          setProtocol(newWeight);
        }
        if (priority[i] === undefined) {
          const newWeight = [...priority];
          newWeight[i] = "";
          setPriority(newWeight);
        }

        finalValue[i] = {
          dns_type: dnsTypes,
          action: actions,
          dns_record_type: dnsRecordTypes[i],
          zone_name: zoneNames[i],
          dns_name: dnsNames[i],
          ip_address: ipAddresses[i],
          fqdn_name: fqdnName[i],
          service: service[i],
          protocol: protocol[i],
          domain: "domain",
          weight: weight[i],
          port_no: port[i],
          priority: priority[i],
          domain_name: "domain",
          c_name: cNames[i],
          service_tier: serviceTier,
          testing_mode: testing,
          description: "description",
          ticket_id: ticketId,
          user: localStorage.getItem("userLoggedIn"),
          scheduled_on: null,
          status: "Pending",
        };
      }
      setFormVal(finalValue);
      console.log("FINAL VALUE============>", finalValue);

      console.log("Forms==============>", formVal);
      alert("ajdvjsvj");
      axios
        .post("http://localhost:3100/api/dns/createDnsRecord", finalValue)
        .then((response) => {
          if (
            response.status === 200 &&
            response.data === "Record created successfully"
          ) {
            if (file) {
            } else {
              navigate("/user", {
                state: {
                  user: "user",
                },
              });
            }
            // Navigate to the user page
          }
          uploadFile(ticketId); // uploading  excel file
          console.log("Response tickets......", response.data);
        })
        .catch((error) => {
          throw error;
        });
      // navigate("/display", {
      //   state: {
      //     data: formVal,
      //   },
      // });
      setValidated(true);
      event.preventDefault();
    }
    // setValidated(true);
  };
  const onDnsChange = (value) => {
    //  console.log("dnsTypes=========>", dnsTypes);
    //  const updatedDnsTypes = [...dnsTypes];
    //  updatedDnsTypes[index] = value;
    setDnsTypes(value);
  };
  const onActionChange = (value) => {
    setActions(value);
    // const updatedActions = [...actions];
    // updatedActions[index] = value;
    // setActions(updatedActions);
    // generateTicketId(value);
  };
  const onServiceTierChange = (value) => {
    // const updatedService = [...serviceTier];
    // updatedService[index] = value;
    setServiceTier(value);
  };

  const onTestingChange = (value) => {
    // const updatedTesting = [...testing];
    // updatedTesting[index] = value;
    setTesting(value);
  };
  const onDnsRecordChange = (index, value) => {
    console.log(index, value);
    const updatedDnsRecordTypes = [...dnsRecordTypes];
    updatedDnsRecordTypes[index] = value;
    setDnsRecordTypes(updatedDnsRecordTypes);
  };

  const onZoneNameChange = (index, value) => {
    const updatedZoneNames = [...zoneNames];
    updatedZoneNames[index] = value;
    setZoneNames(updatedZoneNames);
  };

  const onDnsNameChange = (index, value) => {
    const updatedDnsNames = [...dnsNames];
    updatedDnsNames[index] = value;
    setDnsNames(updatedDnsNames);
  };
  const onTTLChange = (index, value) => {
    const updatedTTl = [...ttl];
    updatedTTl[index] = value;
    setTTL(updatedTTl);
  };
  const onIpAddressChange = (index, value) => {
    const updatedIpAddresses = [...ipAddresses];
    updatedIpAddresses[index] = value;
    setIpAddresses(updatedIpAddresses);
  };
  const onFqdnName = (index, value) => {
    const updatedFqdnName = [...fqdnName];
    updatedFqdnName[index] = value;
    setFqdnName(updatedFqdnName);
  };
  const onCNameChange = (index, value) => {
    const updatedCNames = [...cNames];
    updatedCNames[index] = value;
    setCNames(updatedCNames);
  };

  const onServiceChange = (index, value) => {
    const updatedServ = [...service];
    updatedServ[index] = value;
    setService(updatedServ);
  };
  const onProtocolChange = (index, value) => {
    const updatedProtocol = [...protocol];
    updatedProtocol[index] = value;
    setProtocol(updatedProtocol);
  };

  const onPortChange = (index, value) => {
    const updatePort = [...port];
    updatePort[index] = value;
    setPort(updatePort);
  };

  const onPriorityChange = (index, value) => {
    const updatePriority = [...priority];
    updatePriority[index] = value;
    setPriority(updatePriority);
  };

  const onWeightChange = (index, value) => {
    const updateWeight = [...weight];
    updateWeight[index] = value;
    setWeight(updateWeight);
  };

  const renderRepeatedFormElements = () => {
    const formElements = [];
    for (let i = 0; i < repeatCount; i++) {
      formElements.push(
        <div key={i}>
          <h4>Form #{i + 1}</h4>
          <Grid container spacing={2} className="dnsFormContainer">
            <Grid item xs={12} sm={4}>
              <TextField
                required
                select
                label="DNS Record Type"
                value={dnsRecordTypes[i]}
                onChange={(event) => onDnsRecordChange(i, event.target.value)}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="CNAME">CNAME</MenuItem>
                <MenuItem value="SRV">SRV</MenuItem>
                <MenuItem value="MX">MX</MenuItem>
                <MenuItem value="AAAARecord">AAAARecord</MenuItem>
                <MenuItem value="TXT">TXT</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="Zone Name"
                value={zoneNames[i]}
                onChange={(event) => onZoneNameChange(i, event.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="DNS Name"
                value={dnsNames[i]}
                onChange={(event) => onDnsNameChange(i, event.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="TTL"
                value={ttl[i]}
                onChange={(event) => onTTLChange(i, event.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            {dnsRecordTypes[i] === "MX" && (
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="FQDN Name"
                  value={fqdnName[i]}
                  onChange={(event) => onFqdnName(i, event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            )}

            {(dnsRecordTypes[i] === "A" ||
              dnsRecordTypes[i] === "AAAARecord") && (
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="IP Address"
                  value={ipAddresses[i]}
                  onChange={(event) => onIpAddressChange(i, event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            )}
            {dnsRecordTypes[i] === "CNAME" && (
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="CNAME"
                  value={cNames[i]}
                  onChange={(event) => onCNameChange(i, event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            )}
            {dnsRecordTypes[i] === "SRV" && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Service"
                    value={service[i]}
                    onChange={(event) => onServiceChange(i, event.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Protocol"
                    value={protocol[i]}
                    onChange={(event) =>
                      onProtocolChange(i, event.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Port"
                    value={port[i]}
                    onChange={(event) => onPortChange(i, event.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Priority"
                    value={priority[i]}
                    onChange={(event) =>
                      onPriorityChange(i, event.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Weight"
                    value={weight[i]}
                    onChange={(event) => onWeightChange(i, event.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>
          <br />
        </div>
      );
    }
    return formElements;
  };
  const handleAdd = () => {
    setShowForm(false);
    setRepeatCount(repeatCount + 1);
  };
  return (
    <div>
      <Navbar />
      <br />
      <div className="work-area-implemnent">
        <div className="home-container">
          <div className="home-form">
            <h3 className="home-title">Create DNS Ticket</h3>
            <form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <div className="static-container">
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      label="Project"
                      // value={dnsTypes[i]}
                      onChange={(event) => onDnsChange(event.target.value)}
                      variant="outlined"
                      fullWidth
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      label="Planview code"
                      // value={actions[i]}
                      onChange={(event) => onActionChange(event.target.value)}
                      variant="outlined"
                      fullWidth
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      label="Manager Email"
                      // value={actions[i]}
                      onChange={(event) => onTestingChange(event.target.value)}
                      variant="outlined"
                      fullWidth
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      label="Design Artefacts"
                      // value={actions[i]}
                      onChange={(event) =>
                        onServiceTierChange(event.target.value)
                      }
                      variant="outlined"
                      fullWidth
                    ></TextField>
                  </Grid>
                </Grid>
              </div>
              <div className="static-container">
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      select
                      label="DNS Type"
                      // value={dnsTypes[i]}
                      onChange={(event) => onDnsChange(event.target.value)}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="Internal">Internal</MenuItem>
                      <MenuItem value="External">External</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      select
                      label="Action"
                      // value={actions[i]}
                      onChange={(event) => onActionChange(event.target.value)}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="Create">Create</MenuItem>
                      <MenuItem value="Modify">Modify</MenuItem>
                      <MenuItem value="Delete">Delete</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      select
                      label="Testing mode"
                      // value={actions[i]}
                      onChange={(event) => onTestingChange(event.target.value)}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="bvt">bvt</MenuItem>
                      <MenuItem value="tvt">tvt</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      select
                      label="Service Tier"
                      // value={actions[i]}
                      onChange={(event) =>
                        onServiceTierChange(event.target.value)
                      }
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="Production">Production</MenuItem>
                      <MenuItem value="Non-production">Non-production</MenuItem>
                      <MenuItem value="Staging">Staging</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </div>

              <div className="other-elements" hidden={showForm}>
                {renderRepeatedFormElements()}
              </div>

              {/* <Grid>
                <input type="file" onChange={(e) => onFileChange(e)} />
              </Grid> */}
              <Grid item xs={12} className="submit-button-container">
                <button className="add-btn" onClick={handleAdd}>
                  Add
                </button>
                {"  "}
              </Grid>
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
        {showAlert && (
          <div className="alertDiv">
            <Alert severity="success">
              <AlertTitle>Ticket id: {tId}</AlertTitle>
              <strong>Created Successfully</strong>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
