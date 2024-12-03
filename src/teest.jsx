import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import toast from "react-hot-toast";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SelectInput from "../../components/common/SelectInput";
import dayjs from "dayjs";
import {
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AddCampagin = () => {
  const [contact, setContact] = useState({
    contact_name: "",
    contact_mobile: "",
    contact_email: "",
    contact_address: "",
    contact_group: [],
    contact_state: "",
    contact_pincode: "",
    date: dayjs(),
  });
  const [holidays, setHolidays] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [mobileError, setMobileError] = useState("");
  const [state, setState] = useState([]);
  const [group, setGroup] = useState([]);

  const handleGroupChange = (event) => {
    const { value } = event.target;
    setContact((prev) => ({
      ...prev,
      contact_group: value, // Store the selected groups as an array
    }));
  };

  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt); // Simplified validation

  const onInputChange = (name, value) => {
    if (name === "contact_mobile" && validateOnlyDigits(value)) {
      setContact({ ...contact, contact_mobile: value });
    } else {
      setContact({ ...contact, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);

    if (mobileError) {
      toast.error("Please fix the errors before submitting.");
      setIsButtonDisabled(false);
      return;
    }
    const groupString = contact.contact_group.join(",");

    const data = {
      contact_name: contact.contact_name,
      contact_mobile: contact.contact_mobile,
      contact_email: contact.contact_email,
      contact_address: contact.contact_address,
      contact_group: groupString,
      contact_pincode: contact.contact_pincode,
      contact_state: contact.contact_state,
    };

    try {
      await axios.post(`${BASE_URL}/panel-create-contact`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Contact added successfully!");
      navigate("/Contact");
      setContact({
        contact_name: "",
        contact_mobile: "",
        contact_email: "",
        contact_address: "",
        contact_state: "",
        contact_pincode: "",
        contact_group: "",
      });
    } catch (error) {
      toast.error("Error adding contact!");
      console.error(error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";
  const getHolidays = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/panel-fetch-holiday`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const holidayData = res.data.holiday.map(
        (holiday) => dayjs(holiday.holiday_date) // Convert API dates to Day.js objects
      );
      setHolidays(holidayData);
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
      toast.error("Failed to load holiday data");
    }
  };

  const isDateDisabled = (date) => {
    return holidays.some((holiday) => holiday.isSame(date, "day"));
  };
  const getStateData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/panel-fetch-state`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setState(res.data.state || []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };
  const getGroupData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/panel-fetch-group`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setGroup(res.data.group);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };
  useEffect(() => {
    getStateData();
    getGroupData();
    getHolidays();
  }, []);



  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-4 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-black text-lg flex items-center gap-2">
            Add Campaign
          </h2>
        </div>
        <form
          autoComplete="off"
          onSubmit={onSubmit}
          className="w-full max-w-7xl mx-auto p-6 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SelectInput
                label="Template"
                options={state.map((item) => ({
                  value: item.state_name,
                  label: item.state_name,
                }))}
                required
                value={contact.contact_state || ""}
                name="contact_state"
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
              />
            </div>
            <div>
              <FormLabel required>Subject</FormLabel>
              <input
                name="contact_mobile"
                value={contact.contact_mobile}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
              {mobileError && (
                <p className="text-red-500 text-sm mt-1">{mobileError}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            <FormControl sx={{ width: "100%" }}>
              <FormLabel required>Group Name</FormLabel>
              <Select
                labelId="demo-group-name-label"
                id="demo-group-name"
                multiple
                name="contact_group"
                value={contact.contact_group}
                onChange={handleGroupChange}
                input={
                  <OutlinedInput
                    sx={{
                      width: "100%",
                      fontSize: "0.75rem",
                      border: "1px solid #4caf50",
                      borderRadius: "8px",
                      "&:focus": {
                        outline: "none",
                        borderColor: "#42a5f5",
                        boxShadow: "0 0 0 1px rgba(66, 165, 245, 0.5)",
                      },
                    }}
                    size="small"
                  />
                }
              >
                {group.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.group_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
    

            <div>
              <SelectInput
                label="Contact Individual"
                options={state.map((item) => ({
                  value: item.state_name,
                  label: item.state_name,
                }))}
                required
                value={contact.contact_state || ""}
                name="contact_state"
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="col-span-1">
              <FormLabel >Holiday</FormLabel>
          
              <FormControlLabel
                control={<Checkbox size="large" />}
              />
            </div>

            <div className="col-span-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormLabel required>Date</FormLabel>

                <DatePicker
                  value={contact.date}
                  onChange={(newValue) => onInputChange("date", newValue)}
                  shouldDisableDate={isDateDisabled}
                  sx={{ width: "100%" }}
                  slotProps={{
                    field: {
                      size: "small",
                      sx: {
                        width: "100%",
                        border: "1px solid",
                        borderRadius: "0.375rem",
                        outline: "none",
                        "&:focus": {
                          borderColor: "blue",
                          boxShadow: "0 0 0 1px rgba(59, 130, 246, 1)",
                        },
                        borderColor: "green",
                        "&:hover": {
                          borderColor: "green",
                          boxShadow: "none",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => <input {...params.inputProps} />}
                />
              </LocalizationProvider>
            </div>

            <div className="col-span-2">
              <FormLabel required>Time</FormLabel>
              <input
                name="contact_mobile"
                type="time"
                value={contact.contact_mobile}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <Button
              className="w-36 text-white bg-blue-600"
              type="submit"
              disabled={isButtonDisabled || mobileError}
            >
              {isButtonDisabled ? "Submitting..." : "Submit"}
            </Button>
            <Button
              className="w-36 text-white bg-red-600"
              onClick={() => navigate("/Contact")}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddCampagin;
