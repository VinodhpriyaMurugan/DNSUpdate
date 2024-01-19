import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Axios from "axios";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const [repeatCount, setRepeatCount] = useState(1);
  const [validated, setValidated] = useState(false);
  const [dns_type, setDnsType] = useState("Internal");
  const onDnsChange = ({ target: { value } }) => {
    setDnsType(value);
  };

  const [action, setAction] = useState("Create");
  const onActionChange = ({ target: { value } }) => {
    setAction(value);
  };

  const [dns_record_type, setDnsRecordType] = useState("A");

  const [zone_name, setZoneName] = useState("");

  const [dns_name, setDnsName] = useState("");
  const [ip_address, setIpAddr] = useState("");
  const [c_name, setCName] = useState("");
  useEffect(() => {
    console.log(ip_address, c_name);
  });

  let zoneNameForm = (
    <Form.Group className="mb-3" controlId="zone_name">
      <Form.Label>Zone Name</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="Zone Name"
        onChange={(e) => setZoneName(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please Please provide the zone name.
      </Form.Control.Feedback>
    </Form.Group>
  );

  let DnsNameElement = (
    <Form.Group className="mb-3" controlId="dns_name">
      <Form.Label>DNS Name</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="DNS Name"
        onChange={(e) => setDnsName(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please provide the DNS Name.
      </Form.Control.Feedback>
    </Form.Group>
  );

  let IpAddressElement = (
    <Form.Group className="mb-3" controlId="ip_address">
      <Form.Label>Ip Address</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="Ip Address"
        onChange={(e) => setIpAddr(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please provide the Ip Address.
      </Form.Control.Feedback>
    </Form.Group>
  );

  let CnameElement = (
    <Form.Group className="mb-3" controlId="C_Name">
      <Form.Label>C Name</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="C Name"
        id="c_name"
        onChange={(e) => setCName(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please provide the C Name.
      </Form.Control.Feedback>
    </Form.Group>
  );

  const [service, setService] = useState("");
  let serviceElement = (
    <Form.Group className="mb-3" controlId="service">
      <Form.Label>Service</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="Service"
        onChange={(e) => setService(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please provide the Service.
      </Form.Control.Feedback>
    </Form.Group>
  );
  const [protocol, setProtocol] = useState("");
  let protocolElement = (
    <Form.Group className="mb-3" controlId="protocol">
      <Form.Label>Protocol</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="Protocol"
        onChange={(e) => setProtocol(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please provide the Protocol.
      </Form.Control.Feedback>
    </Form.Group>
  );

  const [portNo, setPortNo] = useState(0);
  let portNoElement = (
    <Form.Group className="mb-3" controlId="port_no">
      <Form.Label>Port No</Form.Label>
      <Form.Control
        required
        type="number"
        placeholder="Port No"
        onChange={(e) => setPortNo(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please provide the Port No.
      </Form.Control.Feedback>
    </Form.Group>
  );
  const [priority, setPriority] = useState(0);
  let priorityElement = (
    <Form.Group className="mb-3" controlId="port_no">
      <Form.Label>Priority</Form.Label>
      <Form.Control
        required
        type="number"
        placeholder="Priority"
        onChange={(e) => setPriority(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please provide the Priority.
      </Form.Control.Feedback>
    </Form.Group>
  );
  const [weight, setweight] = useState(0);
  let weightElement = (
    <Form.Group className="mb-3" controlId="port_no">
      <Form.Label>Weight</Form.Label>
      <Form.Control
        required
        type="number"
        placeholder="Weight"
        onChange={(e) => setweight(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please provide the Weight.
      </Form.Control.Feedback>
    </Form.Group>
  );
  let dnsTypeCol = (
    <Col>
      <Form.Group className="mb-3" controlId="dns_type">
        <Form.Label>DNS Type</Form.Label>
        <Form.Select
          required
          onChange={onDnsChange}
          value={dns_type}
          aria-label="Default select example"
        >
          <option value="Internal">Internal</option>
          <option value="External">External</option>
        </Form.Select>
      </Form.Group>
    </Col>
  );
  let actionCol = (
    <Col>
      <Form.Group className="mb-3" controlId="action">
        <Form.Label>Action</Form.Label>
        <Form.Select
          required
          onChange={onActionChange}
          value={action}
          aria-label="Default select example"
        >
          <option value="Create">Create</option>
          <option value="Delete">Delete</option>
          <option value="Modify">Modify</option>
        </Form.Select>
      </Form.Group>
    </Col>
  );
  const [ttl, setTTL] = useState(0);
  const ARecord = (
    <Row>
      <Col>{zoneNameForm}</Col>
      <Col> {DnsNameElement}</Col>
      <Col>{IpAddressElement}</Col>
    </Row>
  );

  const AAAARecord = (
    <Row>
      <Col>{zoneNameForm}</Col>
      <Col> {DnsNameElement}</Col>
      <Col>{IpAddressElement}</Col>
    </Row>
  );

  const CNAME = (
    <Row>
      <Col>{zoneNameForm}</Col>
      <Col> {DnsNameElement}</Col>
      <Col>{CnameElement}</Col>
    </Row>
  );
  const SRV = (
    <div>
      {" "}
      <Row>
        <Col>{zoneNameForm}</Col>
        <Col> {DnsNameElement}</Col>
        <Col>{serviceElement}</Col>
      </Row>
      <Row>
        <Col>{protocolElement}</Col>
        <Col>{portNoElement}</Col>
        <Col>{priorityElement}</Col>
        <Col>{weightElement}</Col>
      </Row>
    </div>
  );
  const TXT = (
    <Row>
      <Col>{zoneNameForm}</Col>
      <Col> {DnsNameElement}</Col>
      <Col>{IpAddressElement}</Col>
    </Row>
  );
  const MX = (
    <Row>
      <Col>{zoneNameForm}</Col>
      <Col> {DnsNameElement}</Col>
      <Col>{IpAddressElement}</Col>
    </Row>
  );
  const [FormChanges, setFormChanges] = useState(ARecord);
  const onDnsRecordChange = ({ target: { value } }) => {
    setDnsRecordType(value);
    console.log(value);
    switch (value) {
      case "A":
        setFormChanges(ARecord);
        break;
      case "AAAA":
        setFormChanges(AAAARecord);
        break;
      case "CNAME":
        setCName("");

        setFormChanges(CNAME);
        document.getElementById("c_name").reset();
        break;
      case "SRV":
        setFormChanges(SRV);
        break;
      case "TXT":
        setFormChanges(TXT);
        break;
      case "MX":
        setFormChanges(MX);
        break;
      default:
        setFormChanges();
    }
    // setHandleAddForms(FormChanges);
  };
  let dnsRecordCol = (
    <Col>
      <Form.Group className="mb-3" controlId="dns_record_type">
        <Form.Label>DNS Record Type</Form.Label>
        <Form.Select
          required
          aria-label="Default select example"
          onChange={onDnsRecordChange}
        >
          <option value="A">A Record</option>
          <option value="AAAA">AAAA</option>
          <option value="CNAME">CNAME</option>
          <option value="SRV">SRV</option>
          <option value="TXT">TXT</option>
          <option value="MX">MX</option>
        </Form.Select>
      </Form.Group>
    </Col>
  );

  const renderRepeatedFormElements = () => {
    const formElements = [];

    for (let i = 0; i < repeatCount; i++) {
      formElements.push(
        <div key={i}>
          <Row>
            {dnsTypeCol}
            {actionCol}
            {dnsRecordCol}
          </Row>

          {FormChanges}
        </div>
      );
    }
    console.log("formElements", formElements);
    return formElements;
  };

  const handleAddButtonClick = () => {
    setRepeatCount((prevRepeatCount) => prevRepeatCount + 1);
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    let controlValue = {
      dns_type,
      action,
      dns_record_type,
      zone_name,
      dns_name,
      ip_address,
      c_name,
      service,
      protocol,
      portNo,
      priority,
      weight,
      ttl,
    };
    console.log(controlValue);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // `${process.env.REACT_APP_BASE_URL}/api/dns/createDnsRecord`
    // Axios.post(`http://localhost:3100/api/dns/createDnsRecord`, controlValue).then((response) => {
    //     console.log(response.data);
    //     // Handle data
    // })
    //     .catch((error) => {
    //         console.log(error);
    //     })

    // navigate("/display", {
    //     state: {
    //         data: controlValue
    //     }
    // })
    // setValidated(true);
    event.preventDefault();
  };
  return (
    <div className="Home">
      <h3> Welcome to DNS_Updater</h3>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {/* <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="dns_type">
                            <Form.Label>DNS Type</Form.Label>
                            <Form.Select required onChange={onDnsChange} value={dns_type} aria-label="Default select example">

                                <option value="Internal">Internal</option>
                                <option value="External">External</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="action">
                            <Form.Label>Action</Form.Label>
                            <Form.Select required onChange={onActionChange} value={action} aria-label="Default select example">

                                <option value="Create">Create</option>
                                <option value="Delete">Delete</option>
                                <option value="Modify">Modify</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="dns_record_type">
                            <Form.Label>DNS Record Type</Form.Label>
                            <Form.Select required aria-label="Default select example" onChange={onDnsRecordChange}>

                                <option value="A">A Record</option>
                                <option value="AAAA">AAAA</option>
                                <option value="CNAME">CNAME</option>
                                <option value="SRV">SRV</option>
                                <option value="TXT">TXT</option>
                                <option value="MX">MX</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                </Row> */}
        {renderRepeatedFormElements()}
        {/* {FormChanges} */}
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="port_no">
              <Form.Label>TTL</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="TTL"
                onChange={(e) => setTTL(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please provide the TTL.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="primary"
              type="button"
              onClick={handleAddButtonClick}
            >
              Add
            </Button>
          </Col>

          <Col>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Home;

// import React, { useState, useEffect } from "react";
// import { Form, Button, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate();
//   const [repeatCount, setRepeatCount] = useState(1);
//   const [createCount, setCreateCount] = useState(0);
//   const [modifyCount, setModifyCount] = useState(0);
//   const [deleteCount, setDeleteCount] = useState(0);
//   const [dnsTypes, setDnsTypes] = useState(["Internal"]);
//   const [actions, setActions] = useState(["Create"]);
//   const [serviceTier, setServiceTier] = useState(["Production"]);
//   const [testing, setTesting] = useState(["bvt"]);
//   const [dnsRecordTypes, setDnsRecordTypes] = useState(["A"]);
//   const [zoneNames, setZoneNames] = useState([""]);
//   const [dnsNames, setDnsNames] = useState([""]);
//   const [ttl, setTTL] = useState([""]);
//   const [ipAddresses, setIpAddresses] = useState([""]);
//   const [cNames, setCNames] = useState([""]);
//   const [service, setService] = useState([""]);
//   const [protocol, setProtocol] = useState([""]);
//   const [port, setPort] = useState([""]);
//   const [priority, setPriority] = useState([""]);
//   const [weight, setWeight] = useState([""]);
//   const [validated, setValidated] = useState(false);
//   const [formVal, setFormVal] = useState([]);
//   const [ticketId, setTicketId] = useState("");

//   function generateRandomString(length, val) {
//     const characters =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let randomString = val;

//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       randomString += characters.charAt(randomIndex);
//     }
//     const tValue = {
//       id: localStorage.getItem("userId"),
//       ticket: randomString,
//     };
//     axios
//       .post("http://localhost:3100/api/ticket/saveTickets", tValue)
//       .then((Response) => {
//         console.log(Response.data);
//       });
//     return randomString;
//   }

//   const generateTicketId = (value) => {
//     if (value === "Create" && createCount === 0) {
//       setTicketId(generateRandomString(4, "Cr"));
//       setCreateCount(1);
//     } else if (value === "Modify" && modifyCount === 0) {
//       setTicketId(generateRandomString(4, "Mo"));
//       setModifyCount(1);
//     } else if (value === "Delete" && deleteCount === 0) {
//       setTicketId(generateRandomString(4, "De"));
//       setDeleteCount(1);
//     }
//   };
//   const handleFormSubmit = (event) => {
//     const form = event.currentTarget;
//     event.preventDefault();
//     event.stopPropagation();
//     if (form.checkValidity()) {
//       // Submit form data to the server
//       const formData = {
//         dnsTypes,
//         actions,
//         dnsRecordTypes,
//         zoneNames,
//         dnsNames,
//         ipAddresses,
//         cNames,
//         service,
//         protocol,
//         weight,
//         priority,
//         port,
//       };
//       let finalValue = [];
//       for (var i = 0; i < repeatCount; i++) {
//         generateTicketId(actions[i]);
//         if (weight[i] === undefined) {
//           const newWeight = [...weight];
//           newWeight[i] = "";
//           setWeight(newWeight);
//         }
//         if (port[i] === undefined) {
//           const newWeight = [...port];
//           newWeight[i] = "";
//           setPort(newWeight);
//         }
//         if (cNames[i] === undefined) {
//           const newWeight = [...cNames];
//           newWeight[i] = "";
//           setCNames(newWeight);
//         }
//         if (service[i] === undefined) {
//           const newWeight = [...service];
//           newWeight[i] = "";
//           setService(newWeight);
//         }
//         if (protocol[i] === undefined) {
//           const newWeight = [...protocol];
//           newWeight[i] = "";
//           setProtocol(newWeight);
//         }
//         if (priority[i] === undefined) {
//           const newWeight = [...priority];
//           newWeight[i] = "";
//           setPriority(newWeight);
//         }

//         finalValue[i] = {
//           dns_type: dnsTypes,
//           action: actions,
//           dns_record_type: dnsRecordTypes[i],
//           zone_name: zoneNames[i],
//           dns_name: dnsNames[i],
//           ip_address: ipAddresses[i],
//           fqdn_name: "sdf",
//           service: service[i],
//           protocol: protocol[i],
//           domain: "domain",
//           weight: weight[i],
//           port_no: port[i],
//           priority: priority[i],
//           domain_name: "domain",
//           c_name: cNames[i],
//           service_tier: serviceTier,
//           testing_mode: testing,
//           description: "description",
//           ticket_id: ticketId,
//           user: localStorage.getItem("userLoggedIn"),
//         };
//       }
//       setFormVal(finalValue);
//       console.log("FINAL VALUE============>", finalValue);

//       console.log("Forms==============>", formVal);
//       alert("ajdvjsvj");
//       axios
//         .post("http://localhost:3100/api/dns/createDnsRecord", finalValue)
//         .then((response) => {
//           console.log(response.data);
//         })
//         .catch((error) => {});
//       navigate("/display", {
//         state: {
//           data: formVal,
//         },
//       });
//       setValidated(true);
//       event.preventDefault();
//     }
//     // setValidated(true);
//   };

//   // const onDnsChange = (index, value) => {
//   //   console.log("dnsTypes=========>", dnsTypes);
//   //   const updatedDnsTypes = [...dnsTypes];
//   //   updatedDnsTypes[index] = value;
//   //   setDnsTypes(updatedDnsTypes);
//   // };
//   const onDnsChange = (value) => {
//     //  console.log("dnsTypes=========>", dnsTypes);
//     //  const updatedDnsTypes = [...dnsTypes];
//     //  updatedDnsTypes[index] = value;
//     setDnsTypes(value);
//   };
//   const onActionChange = (value) => {
//     setActions(value);
//     // const updatedActions = [...actions];
//     // updatedActions[index] = value;
//     // setActions(updatedActions);
//     // generateTicketId(value);
//   };
//   const onServiceTierChange = (value) => {
//     // const updatedService = [...serviceTier];
//     // updatedService[index] = value;
//     setServiceTier(value);
//   };

//   const onTestingChange = (value) => {
//     // const updatedTesting = [...testing];
//     // updatedTesting[index] = value;
//     setTesting(value);
//   };
//   const onDnsRecordChange = (index, value) => {
//     const updatedDnsRecordTypes = [...dnsRecordTypes];
//     updatedDnsRecordTypes[index] = value;
//     setDnsRecordTypes(updatedDnsRecordTypes);
//   };

//   const onZoneNameChange = (index, value) => {
//     const updatedZoneNames = [...zoneNames];
//     updatedZoneNames[index] = value;
//     setZoneNames(updatedZoneNames);
//   };

//   const onDnsNameChange = (index, value) => {
//     const updatedDnsNames = [...dnsNames];
//     updatedDnsNames[index] = value;
//     setDnsNames(updatedDnsNames);
//   };
//   const onTTLChange = (index, value) => {
//     const updatedTTl = [...ttl];
//     updatedTTl[index] = value;
//     setTTL(updatedTTl);
//   };
//   const onIpAddressChange = (index, value) => {
//     const updatedIpAddresses = [...ipAddresses];
//     updatedIpAddresses[index] = value;
//     setIpAddresses(updatedIpAddresses);
//   };

//   const onCNameChange = (index, value) => {
//     const updatedCNames = [...cNames];
//     updatedCNames[index] = value;
//     setCNames(updatedCNames);
//   };

//   const onServiceChange = (index, value) => {
//     const updatedServ = [...service];
//     updatedServ[index] = value;
//     setService(updatedServ);
//   };
//   const onProtocolChange = (index, value) => {
//     const updatedProtocol = [...protocol];
//     updatedProtocol[index] = value;
//     setProtocol(updatedProtocol);
//   };

//   const onPortChange = (index, value) => {
//     const updatePort = [...port];
//     updatePort[index] = value;
//     setPort(updatePort);
//   };

//   const onPriorityChange = (index, value) => {
//     const updatePriority = [...priority];
//     updatePriority[index] = value;
//     setPriority(updatePriority);
//   };

//   const onWeightChange = (index, value) => {
//     const updateWeight = [...weight];
//     updateWeight[index] = value;
//     setWeight(updateWeight);
//   };
//   const renderRepeatedFormElements = () => {
//     const formElements = [];
//     for (let i = 0; i < repeatCount; i++) {
//       formElements.push(
//         <div key={i} className="repeated-form">
//           <hr />
//           <h4>Form #{i + 1}</h4>
//           {/* <Form.Group as={Row}>
//             <Form.Label column sm="3">
//               DNS Type
//             </Form.Label>
//             <Col sm="6">
//               <Form.Control
//                 as="select"
//                 placeholder="Select"
//                 // value={dnsTypes[i]}
//                 onChange={(e) => onDnsChange(i, e.target.value)}
//               >
//                 <option disabled selected>
//                   Select DNS Type
//                 </option>
//                 <option value="Internal">Internal</option>
//                 <option value="External">External</option>
//               </Form.Control>
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row}>
//             <Form.Label column sm="3">
//               Action
//             </Form.Label>
//             <Col sm="6">
//               <Form.Control
//                 as="select"
//                 // value={actions[i]}
//                 onChange={(e) => onActionChange(i, e.target.value)}
//               >
//                 <option disabled selected>
//                   Action
//                 </option>
//                 <option value="Create">Create</option>
//                 <option value="Delete">Delete</option>
//                 <option value="Modify">Modify</option>
//               </Form.Control>
//             </Col>
//           </Form.Group> */}
//           <Row>
//             <Form.Group as={Col} sm="4">
//               <Form.Label column sm="3">
//                 DNS Record Type
//               </Form.Label>
//               <Col sm="6">
//                 <Form.Control
//                   as="select"
//                   // value={dnsRecordTypes[i]}
//                   onChange={(e) => onDnsRecordChange(i, e.target.value)}
//                 >
//                   <option disabled selected>
//                     Select DNS Record Type
//                   </option>
//                   <option value="A">A</option>
//                   <option value="CNAME">CNAME</option>
//                   <option value="MX">MX</option>
//                   <option value="AAAARecord">AAAARecord</option>
//                   <option value="TXT">TXT</option>
//                   <option value="SRV">SRV</option>
//                 </Form.Control>
//               </Col>
//             </Form.Group>
//           </Row>
//           {/* <Form.Group as={Row}>
//             <Form.Label column sm="3">
//               Service Tier
//             </Form.Label>
//             <Col sm="6">
//               <Form.Control
//                 as="select"
//                 placeholder="Select"
//                 // value={dnsTypes[i]}
//                 onChange={(e) => onServiceTierChange(i, e.target.value)}
//               >
//                 <option disabled selected>
//                   Select Service Tier
//                 </option>
//                 <option value="Internal">Prod</option>
//                 <option value="External">Non-prod</option>
//                 <option value="External">Staging</option>
//               </Form.Control>
//             </Col>
//           </Form.Group> */}
//           {/* <Form.Group as={Row}>
//             <Form.Label column sm="3">
//               Testing
//             </Form.Label>
//             <Col sm="6">
//               <Form.Control
//                 as="select"
//                 placeholder="Select"
//                 // value={dnsTypes[i]}
//                 onChange={(e) => onTestingChange(i, e.target.value)}
//               >
//                 <option disabled selected>
//                   Select Testing
//                 </option>
//                 <option value="Internal">bvt</option>
//                 <option value="External">tvt</option>
//               </Form.Control>
//             </Col>
//           </Form.Group> */}
//           <Row>
//             <Form.Group as={Col} sm="4">
//               <Form.Label column sm="3"></Form.Label>
//               <Col sm="6">
//                 <Form.Control
//                   type="text"
//                   value={zoneNames[i]}
//                   placeholder="Zone Name"
//                   onChange={(e) => onZoneNameChange(i, e.target.value)}
//                   required
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide a zone name.
//                 </Form.Control.Feedback>
//               </Col>
//             </Form.Group>
//             <Form.Group as={Col} sm="4">
//               <Form.Label column sm="3"></Form.Label>
//               <Col sm="6">
//                 <Form.Control
//                   type="text"
//                   placeholder="DNS Name"
//                   value={dnsNames[i]}
//                   onChange={(e) => onDnsNameChange(i, e.target.value)}
//                   required
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide a DNS name.
//                 </Form.Control.Feedback>
//               </Col>
//             </Form.Group>

//             <Form.Group as={Col} sm="4">
//               <Form.Label column sm="3"></Form.Label>
//               <Col sm="6">
//                 <Form.Control
//                   required
//                   type="number"
//                   value={ttl[i]}
//                   placeholder="TTL"
//                   onChange={(e) => onTTLChange(i, e.target.value)}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide the TTL.
//                 </Form.Control.Feedback>
//               </Col>
//             </Form.Group>
//           </Row>
//           {dnsRecordTypes[i] === "A" ||
//             (dnsRecordTypes[i] === "AAAARecord" && (
//               <Form.Group as={Col} sm="4">
//                 <Form.Label column sm="3">
//                   IP Address
//                 </Form.Label>
//                 <Col sm="6">
//                   <Form.Control
//                     type="text"
//                     value={ipAddresses[i]}
//                     onChange={(e) => onIpAddressChange(i, e.target.value)}
//                     required={dnsRecordTypes[i] === "A"}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please provide an IP address.
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//             ))}
//           {dnsRecordTypes[i] === "CNAME" && (
//             <Row>
//               <Form.Group as={Col} sm="4">
//                 <Form.Label column sm="3">
//                   CNAME
//                 </Form.Label>
//                 <Col sm="6">
//                   <Form.Control
//                     type="text"
//                     value={cNames[i]}
//                     onChange={(e) => onCNameChange(i, e.target.value)}
//                     required={dnsRecordTypes[i] === "CNAME"}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please provide a CNAME.
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//             </Row>
//           )}
//           {dnsRecordTypes[i] === "SRV" && (
//             <Row>
//               <Form.Group as={Col} sm="4">
//                 <Form.Label column sm="3"></Form.Label>
//                 <Col sm="6">
//                   <Form.Control
//                     type="text"
//                     placeholder="Service"
//                     onChange={(e) => onServiceChange(i, e.target.value)}
//                     required={dnsRecordTypes[i] === "CNAME"}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please provide the Service.
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Col} sm="4">
//                 <Form.Label column sm="3"></Form.Label>
//                 <Col sm="6">
//                   <Form.Control
//                     type="text"
//                     placeholder="Protocol"
//                     onChange={(e) => onProtocolChange(i, e.target.value)}
//                     required={dnsRecordTypes[i] === "SRV"}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please provide the Protocol.
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Col} sm="4">
//                 <Form.Label column sm="3"></Form.Label>
//                 <Col sm="6">
//                   <Form.Control
//                     required
//                     type="number"
//                     placeholder="Port No"
//                     onChange={(e) => onPortChange(i, e.target.value)}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please provide the Port No.
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Col} sm="4">
//                 <Form.Label column sm="3"></Form.Label>
//                 <Col sm="6">
//                   <Form.Control
//                     required
//                     type="number"
//                     placeholder="Priority"
//                     onChange={(e) => onPriorityChange(i, e.target.value)}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please provide the Priority.
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//               <Form.Group as={Col} sm="4">
//                 <Form.Label column sm="3"></Form.Label>
//                 <Col sm="6">
//                   <Form.Control
//                     required
//                     type="number"
//                     placeholder="Weight"
//                     onChange={(e) => onWeightChange(i, e.target.value)}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Please provide the Weight.
//                   </Form.Control.Feedback>
//                 </Col>
//               </Form.Group>
//             </Row>
//           )}
//         </div>
//       );
//     }
//     return formElements;
//   };

//   const handleAddForm = () => {
//     const formElements = [];
//     const formData = {
//       dnsTypes,
//       actions,
//       dnsRecordTypes,
//       zoneNames,
//       dnsNames,
//       ipAddresses,
//       cNames,
//     };
//     let valuess = [];
//     for (let i = repeatCount - 1; i < repeatCount; i++) {
//       valuess[i] = { actions, cNames, dnsNames, dnsTypes, dnsRecordTypes };
//       //   formElements.push(
//       //     formData.actions[i],formData.cNames[i], formData.dnsTypes[i],formData.dnsRecordTypes[i],
//       //   );
//     }

//     console.log("form values ==============>", valuess);
//     setRepeatCount(repeatCount + 1);
//   };

//   useEffect(() => {
//     setValidated(false);
//   }, [repeatCount]);

//   return (
//     <div>
//       <h2>DNS UPDATE FORM</h2>
//       <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
//         <Row>
//           <Form.Group as={Col} sm="4">
//             <Form.Label></Form.Label>
//             <Form.Control
//               as="select"
//               placeholder="Select"
//               onChange={(e) => onDnsChange(e.target.value)}
//             >
//               <option disabled selected>
//                 Select DNS Type
//               </option>
//               <option value="Internal">Internal</option>
//               <option value="External">External</option>
//             </Form.Control>
//           </Form.Group>

//           <Form.Group as={Col} sm="4">
//             <Form.Label></Form.Label>
//             <Form.Control
//               as="select"
//               onChange={(e) => onActionChange(e.target.value)}
//             >
//               <option disabled selected>
//                 Action
//               </option>
//               <option value="Create">Create</option>
//               <option value="Delete">Delete</option>
//               <option value="Modify">Modify</option>
//             </Form.Control>
//           </Form.Group>

//           <Form.Group as={Col} sm="4">
//             <Form.Label></Form.Label>
//             <Form.Control
//               as="select"
//               placeholder="Select"
//               onChange={(e) => onServiceTierChange(e.target.value)}
//             >
//               <option disabled selected>
//                 Select Service Tier
//               </option>
//               <option value="Prod">Prod</option>
//               <option value="Non-prod">Non-prod</option>
//               <option value="Staging">Staging</option>
//             </Form.Control>
//           </Form.Group>

//           <Form.Group as={Col} sm="4">
//             <Form.Label></Form.Label>
//             <Form.Control
//               as="select"
//               placeholder="Select"
//               onChange={(e) => onTestingChange(e.target.value)}
//             >
//               <option disabled selected>
//                 Select Testing
//               </option>
//               <option value="bvt">bvt</option>
//               <option value="tvt">tvt</option>
//             </Form.Control>
//           </Form.Group>
//         </Row>

//         {/* <Form.Group as={Row}>
//           <Form.Label column sm="3">
//             DNS Type
//           </Form.Label>
//           <Col sm="6">
//             <Form.Control
//               as="select"
//               placeholder="Select"
//               // value={dnsTypes[i]}
//               onChange={(e) => onDnsChange(e.target.value)}
//             >
//               <option disabled selected>
//                 Select DNS Type
//               </option>
//               <option value="Internal">Internal</option>
//               <option value="External">External</option>
//             </Form.Control>
//           </Col>
//         </Form.Group>
//         <Form.Group as={Row}>
//           <Form.Label column sm="3">
//             Action
//           </Form.Label>
//           <Col sm="6">
//             <Form.Control
//               as="select"
//               // value={actions[i]}
//               onChange={(e) => onActionChange(e.target.value)}
//             >
//               <option disabled selected>
//                 Action
//               </option>
//               <option value="Create">Create</option>
//               <option value="Delete">Delete</option>
//               <option value="Modify">Modify</option>
//             </Form.Control>
//           </Col>
//         </Form.Group>
//         <Form.Group as={Row}>
//           <Form.Label column sm="3">
//             Service Tier
//           </Form.Label>
//           <Col sm="6">
//             <Form.Control
//               as="select"
//               placeholder="Select"
//               // value={dnsTypes[i]}
//               onChange={(e) => onServiceTierChange(e.target.value)}
//             >
//               <option disabled selected>
//                 Select Service Tier
//               </option>
//               <option value="Internal">Prod</option>
//               <option value="External">Non-prod</option>
//               <option value="External">Staging</option>
//             </Form.Control>
//           </Col>
//         </Form.Group>
//         <Form.Group as={Row}>
//           <Form.Label column sm="3">
//             Testing
//           </Form.Label>
//           <Col sm="6">
//             <Form.Control
//               as="select"
//               placeholder="Select"
//               // value={dnsTypes[i]}
//               onChange={(e) => onTestingChange(e.target.value)}
//             >
//               <option disabled selected>
//                 Select Testing
//               </option>
//               <option value="Internal">bvt</option>
//               <option value="External">tvt</option>
//             </Form.Control>
//           </Col>
//         </Form.Group> */}
//         {renderRepeatedFormElements()}
//         <Row>
//           <Form.Group as={Col} sm="9">
//             <Form.Label column sm="3"></Form.Label>
//             <Col sm="3">
//               <Form.Control
//                 type="file"
//                 onChange={(e) => onFileChange(i, e.target.files[0])}
//               />
//             </Col>
//           </Form.Group>
//         </Row>
//         <Row>
//           <Button variant="primary" onClick={handleAddForm}>
//             Add Form
//           </Button>
//           <Button variant="primary" type="submit">
//             Submit
//           </Button>
//         </Row>
//       </Form>
//     </div>
//   );
// };

// export default Home;
