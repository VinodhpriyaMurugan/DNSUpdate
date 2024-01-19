import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';
import "./home.css";

const Home = () => {
    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);
    const [dt, dty] = useState("Internal");
  

    const [action, setAction] = useState('Create');
   

    const [dtype, setDType] = useState('A');

    const [zname, setZname] = useState("");

    const [dname, setDName] = useState("");
    const [i, setIr] = useState("");
    const [cn, setCN] = useState("")
    useEffect(() => {
      
    })

    let nform = <Form.Group className="mb-3" controlId="zone_name">
        <Form.Label>Naam</Form.Label>
        <Form.Control required type="text" placeholder="Zone Name" onChange={(e) => setZname(e.target.value)} />
        <Form.Control.Feedback type="invalid">
            Please Please provide the zone name.
        </Form.Control.Feedback>
    </Form.Group>;

    let nelement = <Form.Group className="mb-3" controlId="dns_name">
        <Form.Label>DName</Form.Label>
        <Form.Control required type="text" placeholder="DNS Name" onChange={(e) => setDName(e.target.value)} />
        <Form.Control.Feedback type="invalid">
            Please provide the DNS Name.
        </Form.Control.Feedback>
    </Form.Group>

 
  


   
    const AR = <Row>
        <Col>
            {nform}
        </Col>
        <Col> {nelement}</Col>
      
    </Row>

    const AA = <Row>
        <Col>
            {nform}
        </Col>
        <Col> {nelement}</Col>
      
    </Row>


  
  
    const [FormChanges, setFormChanges] = useState(ARecord);
    const ondchnage = ({ target: { value } }) => {
        setDType(value);
        console.log(value)
        switch (value) {
            case "AR":
                setFormChanges(ARecord)
                break;
            case "AA":
                setFormChanges(AAAARecord)
                break;
       
            default:
                setFormChanges()
        }
    }
   
    return (
        <div className='Home'>
            <h3> Welcome to DNS_Updater</h3>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                   
               
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label>DNS Record Type</Form.Label>
                            <Form.Select required aria-label="Default select example" onChange={ondchnage}>

                                <option value="AR">A </option>
                                <option value="AA">AA</option>
                               
                            </Form.Select>
                        </Form.Group>
                    </Col>

                </Row>
{/* */}
                {FormChanges}
                <Row>
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label>TS</Form.Label>
                            <Form.Control required type="number" placeholder="TS"  />
                            <Form.Control.Feedback type="invalid">
                                Please provide the TS.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default Home;