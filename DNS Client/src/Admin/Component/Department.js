import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "./Component.css";
const baseUrl = "http://localhost:3100";
function Department() {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [departmentValue, setDepartmentValue] = useState("");
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/component/getAll`);
        console.log("response==========>", response.data);
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const saveDepartment = async () => {
    console.log(selectedBranchId, departmentValue);

    try {
      await axios.post(`${baseUrl}/api/component/dept/saveDepartment`, {
        branchId: selectedBranchId,
        department: departmentValue,
      });
      console.log("Department saved successfully!");
      // Add any additional logic or feedback message as needed
    } catch (error) {
      console.error("Error saving department:", error);
      // Handle error case as needed
    }
  };

  return (
    <div className="work-area-department">
      <Select
        options={branches.map((branch) => ({
          value: branch.id,
          label: `${branch.branch}`,
        }))}
        onChange={(selectedOption) => setSelectedBranchId(selectedOption.value)}
      />

      <input
        type="text"
        value={departmentValue}
        onChange={(e) => setDepartmentValue(e.target.value)}
      />

      <button onClick={saveDepartment}>Save Department</button>
    </div>
  );
}

export default Department;
