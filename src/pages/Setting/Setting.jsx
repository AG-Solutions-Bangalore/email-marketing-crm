import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import toast from "react-hot-toast";
import { Button } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import SelectInput from "../../components/common/SelectInput";
import { FormControl, MenuItem, OutlinedInput, Select } from "@mui/material";

const Setting = () => {
  const [setting, setSetting] = useState({
    company_name: "",
    email_time: [],
    reply_to: "",
    company_address: "",
    company_state: "",
    company_pincode: "",
    company_website: "",
    cc_to: "",
  });
  const Time = Array.from({ length: 24 }, (_, i) => {
    const value = String(i + 1).padStart(2, "0");
    return { value, label: value };
  });
  console.log(Time);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [state, setState] = useState([]);

  const onInputChange = (name, value) => {
    console.log(value);
    setSetting({ ...setting, [name]: value });
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
  const getCompanyData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/panel-fetch-company`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const contactData = res.data.company;
      const contactGroup = contactData.email_time
        ? contactData.email_time.split(",")
        : [];

      setSetting({
        ...contactData,
        email_time: contactGroup,
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };
  useEffect(() => {
    getStateData();
    getCompanyData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const groupString = setting.email_time.join(",");

    const data = {
      company_name: setting.company_name,
      email_time: groupString,
      reply_to: setting.reply_to,
      company_address: setting.company_address,
      company_pincode: setting.company_pincode,
      company_state: setting.company_state,
      company_website: setting.company_website,
      cc_to: setting.cc_to,
    };
    console.log(data);
    try {
      await axios.post(`${BASE_URL}/panel-update-company`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Setting Updated successfully!");
      navigate("/home");
      setSetting({
        company_name: "",
        email_time: "",
        reply_to: "",
        company_address: "",
        company_state: "",
        company_pincode: "",
        contact_group: [],
        cc_to: "",
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
  const handleGroupChange = (event) => {
    const { value } = event.target;
    if (value.length > 4) {
      toast("You can select a maximum of 4 options.");
    } else {
      setSetting((prev) => ({
        ...prev,
        email_time: value,
      }));
    }
  };

  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-4 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-black text-lg flex items-center gap-2">
            Setting
          </h2>
        </div>
        <form
          autoComplete="off"
          onSubmit={onSubmit}
          className="w-full max-w-7xl mx-auto p-6 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <FormLabel required> Name</FormLabel>
              <input
                type="text"
                name="company_name"
                value={setting.company_name}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel required>Select Time Slot(Max Four)</FormLabel>
              <Select
                labelId="demo-group-name-label"
                id="demo-group-name"
                multiple
                name="email_time"
                value={setting.email_time}
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
                {Time.map((group) => (
                  <MenuItem key={group.value} value={group.value}>
                    {group.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div>
              <FormLabel required>Reply To</FormLabel>
              <input
                type="email"
                name="reply_to"
                value={setting.reply_to}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel>Cc to</FormLabel>
              <input
                type="email"
                value={setting.cc_to || ""}
                name="cc_to"
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <div>
              <FormLabel required>Address</FormLabel>
              <textarea
                name="company_address"
                value={setting.company_address}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                rows="3"
                className={inputClass}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
            <div>
              <SelectInput
                label="State"
                options={state.map((item) => ({
                  value: item.state_name,
                  label: item.state_name,
                }))}
                required
                value={setting.company_state || ""}
                name="company_state"
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
              />
            </div>

            <div>
              <FormLabel required>Pincode</FormLabel>
              <input
                name="company_pincode"
                type="tel"
                maxLength={6}
                value={setting.company_pincode}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Website</FormLabel>
              <input
                value={setting.company_website || ""}
                name="company_website"
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
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Updateting..." : "Update"}
            </Button>
            <Button
              className="w-36 text-white bg-red-600"
              onClick={() => navigate("/home")}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Setting;
