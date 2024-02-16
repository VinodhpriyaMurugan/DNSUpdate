import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./home.css";
const Home = () => {
  const navigate = useNavigate();
  const [repeatCount, setRepeatCount] = useState(1);
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
  const [cNames, setCNames] = useState([""]);
  const [service, setService] = useState([""]);
  const [protocol, setProtocol] = useState([""]);
  const [port, setPort] = useState([""]);
  const [priority, setPriority] = useState([""]);
  const [weight, setWeight] = useState([""]);
  const [validated, setValidated] = useState(false);
  const [formVal, setFormVal] = useState([]);
  const [file, setFile] = useState("");
  // const [ticketId, setTicketId] = useState("");

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

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async (value) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("ticket", value);
    formData.append("id", localStorage.getItem("userId"));
    console.log("====================================");
    console.log("Form data=======>", formData);
    console.log("====================================");
    await axios
      .post("http://localhost:3100/api/ticket/saveTickets", formData)
      .then((Response) => {
        navigate("/user", {
          state: {
            user: "user",
          },
        });
        console.log("File upload response ======>", Response.data);
      });
  };
  const handleFormSubmit = async (event) => {
    var ticketId = generateTicketId();
    console.log("ticketId", ticketId);
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
          fqdn_name: "sdf",
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
        };
      }
      setFormVal(finalValue);
      console.log("FINAL VALUE============>", finalValue);

      console.log("Forms==============>", formVal);

      axios
        .post("http://localhost:3100/api/dns/createDnsRecord", finalValue)
        .then((response) => {
          if (
            response.status === 200 &&
            response.data === "Record created successfully"
          ) {
            console.log("file ====================>", file);

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
          uploadFile(ticketId);
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

  // const onDnsChange = (index, value) => {
  //   console.log("dnsTypes=========>", dnsTypes);
  //   const updatedDnsTypes = [...dnsTypes];
  //   updatedDnsTypes[index] = value;
  //   setDnsTypes(updatedDnsTypes);
  // };
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
        <div key={i} className="repeated-form">
          <hr />
          <h4>Form #{i + 1}</h4>

          <Row>
            <Form.Group as={Col} sm="4">
              <Form.Label column sm="3">
                DNS Record Type
              </Form.Label>
              <Col sm="6">
                <Form.Control
                  as="select"
                  // value={dnsRecordTypes[i]}
                  onChange={(e) => onDnsRecordChange(i, e.target.value)}
                >
                  <option disabled selected>
                    Select DNS Record Type
                  </option>
                  <option value="A">A</option>
                  <option value="CNAME">CNAME</option>
                  <option value="MX">MX</option>
                  <option value="AAAARecord">AAAARecord</option>
                  <option value="TXT">TXT</option>
                  <option value="SRV">SRV</option>
                </Form.Control>
              </Col>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} sm="3">
              <Form.Label column sm="3"></Form.Label>
              <Col sm="6">
                <Form.Control
                  type="text"
                  value={zoneNames[i]}
                  placeholder="Zone Name"
                  onChange={(e) => onZoneNameChange(i, e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a zone name.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Form.Group as={Col} sm="3">
              <Form.Label column sm="3"></Form.Label>
              <Col sm="6">
                <Form.Control
                  type="text"
                  placeholder="DNS Name"
                  value={dnsNames[i]}
                  onChange={(e) => onDnsNameChange(i, e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a DNS name.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Col} sm="3">
              <Form.Label column sm="3"></Form.Label>
              <Col sm="6">
                <Form.Control
                  required
                  type="number"
                  value={ttl[i]}
                  placeholder="TTL"
                  onChange={(e) => onTTLChange(i, e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide the TTL.
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Row>
          {dnsRecordTypes[i] === "A" ||
            (dnsRecordTypes[i] === "AAAARecord" && (
              <Form.Group as={Col} sm="3">
                <Form.Label column sm="3">
                  IP Address
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="text"
                    value={ipAddresses[i]}
                    onChange={(e) => onIpAddressChange(i, e.target.value)}
                    required={dnsRecordTypes[i] === "A"}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide an IP address.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            ))}
          {dnsRecordTypes[i] === "CNAME" && (
            <Row>
              <Form.Group as={Col} sm="3">
                <Form.Label column sm="3">
                  CNAME
                </Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="text"
                    value={cNames[i]}
                    onChange={(e) => onCNameChange(i, e.target.value)}
                    required={dnsRecordTypes[i] === "CNAME"}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a CNAME.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </Row>
          )}
          {dnsRecordTypes[i] === "SRV" && (
            <Row>
              <Form.Group as={Col} sm="3">
                <Form.Label column sm="3"></Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="text"
                    placeholder="Service"
                    onChange={(e) => onServiceChange(i, e.target.value)}
                    required={dnsRecordTypes[i] === "SRV"}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide the Service.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Col} sm="3">
                <Form.Label column sm="3"></Form.Label>
                <Col sm="6">
                  <Form.Control
                    type="text"
                    placeholder="Protocol"
                    onChange={(e) => onProtocolChange(i, e.target.value)}
                    required={dnsRecordTypes[i] === "SRV"}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide the Protocol.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Col} sm="3">
                <Form.Label column sm="3"></Form.Label>
                <Col sm="6">
                  <Form.Control
                    required
                    type="number"
                    placeholder="Port No"
                    onChange={(e) => onPortChange(i, e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide the Port No.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Col} sm="3">
                <Form.Label column sm="3"></Form.Label>
                <Col sm="6">
                  <Form.Control
                    required
                    type="number"
                    placeholder="Priority"
                    onChange={(e) => onPriorityChange(i, e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide the Priority.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Col} sm="3">
                <Form.Label column sm="3"></Form.Label>
                <Col sm="6">
                  <Form.Control
                    required
                    type="number"
                    placeholder="Weight"
                    onChange={(e) => onWeightChange(i, e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide the Weight.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </Row>
          )}
        </div>
      );
    }
    return formElements;
  };

  const handleAddForm = () => {
    const formElements = [];
    const formData = {
      dnsTypes,
      actions,
      dnsRecordTypes,
      zoneNames,
      dnsNames,
      ipAddresses,
      cNames,
    };
    let valuess = [];
    for (let i = repeatCount - 1; i < repeatCount; i++) {
      valuess[i] = { actions, cNames, dnsNames, dnsTypes, dnsRecordTypes };
    }

    console.log("form values ==============>", valuess);
    setRepeatCount(repeatCount + 1);
  };

  useEffect(() => {
    setValidated(false);
  }, [repeatCount]);

  return (
    <div>
      <Navbar />
      <div className="work-area-home">
        <h2 className="dnsFormTag">DNS Update Form</h2>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleFormSubmit}
          className="forms-home"
        >
          <Row>
            <Form.Group as={Col} sm="3">
              <Form.Label></Form.Label>
              <Form.Control
                as="select"
                placeholder="Select"
                onChange={(e) => onDnsChange(e.target.value)}
              >
                <option disabled selected>
                  Select DNS Type
                </option>
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} sm="3">
              <Form.Label></Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => onActionChange(e.target.value)}
              >
                <option disabled selected>
                  Action
                </option>
                <option value="Create">Create</option>
                <option value="Delete">Delete</option>
                <option value="Modify">Modify</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} sm="3">
              <Form.Label></Form.Label>
              <Form.Control
                as="select"
                placeholder="Select"
                onChange={(e) => onServiceTierChange(e.target.value)}
              >
                <option disabled selected>
                  Select Service Tier
                </option>
                <option value="Prod">Prod</option>
                <option value="Non-prod">Non-prod</option>
                <option value="Staging">Staging</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} sm="3">
              <Form.Label></Form.Label>
              <Form.Control
                as="select"
                placeholder="Select"
                onChange={(e) => onTestingChange(e.target.value)}
              >
                <option disabled selected>
                  Select Testing
                </option>
                <option value="bvt">bvt</option>
                <option value="tvt">tvt</option>
              </Form.Control>
            </Form.Group>
          </Row>

          {renderRepeatedFormElements()}
          <Row>
            <Form.Group as={Col} sm="9">
              <Form.Label column sm="3"></Form.Label>
              <Col sm="3">
                <Form.Control type="file" onChange={(e) => onFileChange(e)} />
              </Col>
            </Form.Group>
          </Row>
          <Row>
            <Row>
              <Form.Group as={Col} sm="9">
                <Form.Label column sm="3"></Form.Label>
              </Form.Group>
            </Row>
            <Row></Row>
            <Button variant="primary" onClick={handleAddForm}>
              Add Form
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default Home;
