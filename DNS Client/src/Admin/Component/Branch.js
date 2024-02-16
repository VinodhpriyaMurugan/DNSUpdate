import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import Navbar from "../../Navbar/Navbar";
import Department from "./Department";
import { baseUrl } from "../../config/UrlConfig";

function Branch() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [branches, setBranches] = useState([]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddOption();
    }
  };

  const handleAddOption = () => {
    if (inputValue.trim() !== "") {
      console.log("input value=======>  ", inputValue);
      const branchValues = inputValue;
      const newOption = { value: inputValue, label: inputValue };
      setOptions((prevOptions) => [...prevOptions, newOption]);
      setSelectedOption(newOption);
      setInputValue("");
      handleAddBranch(branchValues);
    }
  };

  const handleAddBranch = (branch) => {
    setBranches((prevBranches) => [...prevBranches, branch]);
  };

  const saveBranchesToServer = () => {
    console.log("Branches======>", branches);
    axios
      .post(`${baseUrl}/api/component/saveBranch`, branches)
      .then((response) => {
        console.log("Branches saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving branches:", error);
      });
  };

  return (
    <div className="page-body">
      <Navbar />
      <div className="work-area-implement">
        <Select
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAddOption}>OK</button>
        </div>
        <button onClick={saveBranchesToServer}>Save to Server</button>
      </div>
      <Department />
    </div>
  );
}

export default Branch;
