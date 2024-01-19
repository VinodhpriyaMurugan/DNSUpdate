import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import "./Implement.css";
import DisplayByDns from "../../display/DisplayByDns";
import { useNavigate } from "react-router-dom";

function Implement() {
  const navigate = useNavigate();
  const dnsTypes = ["ALL TYPES", "AAAA", "A", "SRV", "TXT", "MX", "CNAME"];
  const [dnsrecordType, setDnsRecordType] = useState("ALL TYPES");
  const handleRecordTypeClick = (val) => {
    setDnsRecordType(val);
  };
  useEffect(() => {
    // This useEffect hook will trigger whenever the dnsrecordType state changes
    // You can perform any logic here that requires the updated value
    console.log("dnsrecordType:", dnsrecordType);
  }, [dnsrecordType]);
  const goToHome = () => {
    navigate("/dashboard", {
      state: { user: "Admin" },
    });
  };
  // const setDate = ()=>{

  // }
  return (
    <div className="page-body">
      <Navbar />
      <div className="work-area-implement">
        <button className="run-btn" onClick={goToHome}>
          Home
        </button>
        <h1></h1>
        <div className="category-area">
          {dnsTypes.map((value, index) => (
            <button
              key={index}
              className="category-item"
              onClick={() => handleRecordTypeClick(value)}
            >
              {value}
              <span className="icon">{">"}</span>
            </button>
          ))}
        </div>
        <div className="display-area">
          <DisplayByDns value={dnsrecordType} />
        </div>
      </div>
    </div>
  );
}

export default Implement;
