
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { JsonToTable } from "react-json-to-table";
import { useLocation, useNavigate } from "react-router-dom";
import "./display.css";
import axios from 'axios';
function Display(){
    const [jsonTableArrayData, setJsonTableData] = useState([]);
    const [tableToDisplay, setTableDataToDisplay] = useState([]);
    const [outPutToDisplay, setOutput] = useState("")
    const location = useLocation();
  
    const navigate = useNavigate();
    const runDns = (id) => {
        console.log("Run Dns Id", id)
        // ${process.env.REACT_APP_BASE_URL}/api/dns/runDNSByCSV
        axios.get(`http://localhost:3100/api/dns/runDNSByCSV`, { params: { id: id } }).then((response) => {
            console.log(response.data);
            // Handle data
            setOutput(response.data)

        })
    }
 useEffect(async()=>{
    console.log("useefeect")
  await  axios.get(`http://localhost:3100/api/dns/getCreateActionDnsRecord`).then((response) => {
        console.log(response.data);
        // Handle data
        setJsonTableData([...response.data])

        {
            let tableToDisplay = response.data.map(a => {
                console.log(a)
              
              
                // return <div key={a.id}> < table  ><td><JsonToTable json={a} /></td><td><Button key={a.id} onClick={(e) => { e.preventDefault(); runDns(a.id) }}>Run</Button></td></table> </div>

            })
            setTableDataToDisplay(tableToDisplay)
        }       
      

    })
 })
    const getCreateRecord = () => {
        // ${process.env.REACT_APP_BASE_URL}/api/dns/getCreateActionDnsRecord
        
        axios.get(`http://localhost:3100/api/dns/getCreateActionDnsRecord`).then((response) => {
            console.log(response.data);
            // Handle data
            setJsonTableData([...response.data])

            {
                let tableToDisplay = response.data.map(a => {
                    console.log(a)
                    headers = Object.keys(response.data[0])
                    return headers
                  
                    // return <div key={a.id}> < table  ><td><JsonToTable json={a} /></td><td><Button key={a.id} onClick={(e) => { e.preventDefault(); runDns(a.id) }}>Run</Button></td></table> </div>

                })
                setTableDataToDisplay(tableToDisplay)
            }       
          

        })
    }
  const headers = Object.keys(jsonTableArrayData[0]);
    return (
        <div>
            <div className='Col1'>
                <Button onClick={() => navigate("/home")}>Back</Button>              
                <Button onClick={getCreateRecord}>Get Create Record</Button>

                {tableToDisplay}
            </div>
            <div className='Col2'>
                <pre>{outPutToDisplay}</pre>
            </div>
          <div>
          {jsonTableArrayData!== undefined || jsonTableArrayData !== null || jsonTableArrayData.length > 0 ? (
            <table className='displayTable'>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {headers.map((obj) => (
            <tr key={obj.id}>
              {headers.map(header => (
                <td key={header}>{obj[header]}</td>
              ))}
        <td><Button key={obj.id} onClick={(e) => { e.preventDefault(); runDns(obj.id) }}>Run</Button></td>
            
            </tr>
          ))}
        </tbody>
      </table>):('')}
          </div>
       
        </div >
    )
}

export default DisplayRagu;