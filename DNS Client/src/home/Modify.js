import { useState } from "react";
import { Alert, AlertTitle, Button, Grid, TextField } from "@mui/material";
import { MenuItem, Modal } from "@material-ui/core";
import axios from "axios";
import { baseUrl } from "../config/UrlConfig";
import { SuccessToastAlert } from "../Admin/Toast";
import { useNavigate } from "react-router-dom";
const Modify = ({ data }) => {
  const [formValue, setFormValues] = useState(data);
  const onDnsRecordChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].dns_record_type = value;
      return updatedFormValues;
    });
  };

  const onZoneNameChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].zone_name = value;
      return updatedFormValues;
    });
  };

  const onDnsNameChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].dns_name = value;
      return updatedFormValues;
    });
  };

  const onTTLChange = (index, value) => {
    alert(value);
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].ttl = value;
      console.log("updatedFormValues", updatedFormValues);
      return updatedFormValues;
    });
  };

  const onFqdnNameChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].fqdn_name = value;
      return updatedFormValues;
    });
  };

  const onIpAddressChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].ip_address = value;
      return updatedFormValues;
    });
  };

  const onCNameChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].c_name = value;
      return updatedFormValues;
    });
  };

  const onTargetValueChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].target_value = value;
      return updatedFormValues;
    });
  };

  const onServiceChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].service = value;
      return updatedFormValues;
    });
  };

  const onProtocolChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].protocol = value;
      return updatedFormValues;
    });
  };

  const onPortChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].port_no = value;
      return updatedFormValues;
    });
  };

  const onPriorityChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].priority = value;
      return updatedFormValues;
    });
  };

  const onWeightChange = (index, value) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues[index].weight = value;
      return updatedFormValues;
    });
  };
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/user", {
      state: { value: "false" },
    });
  };
  const handleFormSubmit = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/dns/updateRecord`,
        formValue
      );
      SuccessToastAlert("File uploaded successfully");
      navigate("/user", {
        state: { value: "false" },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const renderRepeatedFormElements = () => {
    const formElements = [];
    formValue.forEach((formVal, i) => {
      formElements.push(
        <div key={i}>
          <h4>Form #{i + 1}</h4>
          <Grid container spacing={2} className="dnsFormContainer">
            <Grid item xs={12} sm={4}>
              <TextField
                required
                select
                label="DNS Record Type"
                value={formVal.dns_record_type}
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
                value={formVal.zone_name}
                onChange={(event) => onZoneNameChange(i, event.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="DNS Name"
                value={formVal.dns_name}
                onChange={(event) => onDnsNameChange(i, event.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="TTL"
                value={formVal.ttl}
                onChange={(event) => onTTLChange(i, event.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            {formVal.dns_record_type === "MX" && (
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="FQDN Name"
                  value={formVal.fqdn_name}
                  onChange={(event) => onFqdnNameChange(i, event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            )}

            {(formVal.dns_record_type === "A" ||
              formVal.dnsRecordTypes === "AAAARecord") && (
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="IP Address"
                  value={formVal.ip_address}
                  onChange={(event) => onIpAddressChange(i, event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            )}
            {formVal.dns_record_type === "CNAME" && (
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="CNAME Target Value"
                  value={formVal.c_name}
                  onChange={(event) => onCNameChange(i, event.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            )}
            {formVal.dns_record_type === "TXT" && (
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  label="Target Value"
                  value={formVal.target_value}
                  onChange={(event) =>
                    onTargetValueChange(i, event.target.value)
                  }
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            )}
            {formVal.dns_record_type === "SRV" && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Service"
                    value={formVal.service}
                    onChange={(event) => onServiceChange(i, event.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Protocol"
                    value={formVal.protocol}
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
                    value={formVal.port_no}
                    onChange={(event) => onPortChange(i, event.target.value)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    label="Priority"
                    value={formVal.priority}
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
                    value={formVal.weight}
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
    });
    return formElements;
  };
  return (
    <>
      {renderRepeatedFormElements()}
      <Button variant="contained" color="primary" onClick={handleFormSubmit}>
        Update
      </Button>
    </>
  );
};
export default Modify;
