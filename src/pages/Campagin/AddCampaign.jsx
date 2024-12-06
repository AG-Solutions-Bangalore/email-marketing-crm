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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AddCampagin = () => {
  const [campagin, setCampagin] = useState({
    campaign_list_template_id: "",
    campaign_list_subject: "",
    campaign_list_group: [],
    campaign_list_individual: "",
    campaign_list_date: dayjs(""),
    campaign_list_holiday: "",
    campaign_list_time: "",
    campaign_list_name: "",
  });
  const [holidays, setHolidays] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [template, setTemplate] = useState([]);
  const [group, setGroup] = useState([]);
  const [email, setEmail] = useState([]);
  const handleGroupChange = (event) => {
    const { value } = event.target;
    // console.log(value);
    setCampagin((prev) => ({
      ...prev,
      campaign_list_group: value,
    }));
  };

  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt); // Simplified validation

  const onInputChange = (name, value) => {
    if (name === "contact_mobile" && validateOnlyDigits(value)) {
      setCampagin({ ...campagin, campaign_list_subject: value });
    } else {
      setCampagin({ ...campagin, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const result = checkboxChecked ? "Yes" : "No";
    console.log("Submitted:", result);
    const groupString = campagin.campaign_list_group.join(",");
    const formattedDate = dayjs(campagin.campaign_list_date).format(
      "YYYY-MM-DD"
    );
    const groupSelected = Boolean(groupString);
    const individualSelected = Boolean(campagin.campaign_list_individual);

    if (groupSelected && individualSelected) {
      toast.error("Please select only one option: Group or Individual!");
      return;
    }

    if (!groupSelected && !individualSelected) {
      toast.error("Please select at least one option: Group or Individual!");
      return;
    }
    const data = {
      campaign_list_template_id: campagin.campaign_list_template_id,
      campaign_list_subject: campagin.campaign_list_subject,
      campaign_list_date: formattedDate,
      campaign_list_time: campagin.campaign_list_time,
      campaign_list_group: groupString,
      campaign_list_individual: campagin.campaign_list_individual,
      campaign_list_holiday: result,
      campaign_list_name: campagin.campaign_list_name,
    };

    try {
      await axios.post(`${BASE_URL}/panel-create-campaign`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("/campaign added successfully!");
      navigate("/campaigns");
      setCampagin({
        campaign_list_template_id: "",
        campaign_list_subject: "",
        contact_email: "",
        contact_address: "",
        contact_state: "",
        contact_pincode: "",
        campaign_list_group: "",
        campaign_list_holiday: "",
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

      const holidayData = res.data.holiday.map((holiday) =>
        dayjs(holiday.holiday_date)
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
  const getTemplate = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/panel-fetch-template`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTemplate(res.data.template || []);
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
  const getEmailData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/panel-fetch-individual-email`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setEmail(res.data.individualEmail);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };
  const onTemplateChange = (name, value) => {
    const templateId = Number(value);
    const selectedTemplate = template.find((item) => item.id === templateId);

    if (selectedTemplate) {
      setCampagin((prev) => ({
        ...prev,
        [name]: value,
        campaign_list_subject: selectedTemplate.template_subject,
      }));
    } else {
      console.error("Template not found for id:", templateId);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getEmailData(),
        getTemplate(),
        getGroupData(),
        getHolidays(),
      ]);
    };
    fetchData();
  }, []);

  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setCheckboxChecked(e.target.checked);
    console.log(e.target.checked);
  };
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-4 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-black text-lg flex items-center gap-2">
            Create Campaign
          </h2>
        </div>
        <form
          autoComplete="off"
          onSubmit={onSubmit}
          className="w-full max-w-7xl mx-auto p-6 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <FormLabel required>Campagin Name</FormLabel>
              <input
                name="campaign_list_name"
                value={campagin.campaign_list_name}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <SelectInput
                label="Template"
                options={template.map((item) => ({
                  value: item.id,
                  label: item.template_name,
                }))}
                required
                value={campagin.campaign_list_template_id || ""}
                name="campaign_list_template_id"
                onChange={(e) =>
                  onTemplateChange(e.target.name, e.target.value)
                }
              />
            </div>
            <div>
              <FormLabel required>Subject</FormLabel>
              <input
                name="campaign_list_subject"
                value={campagin.campaign_list_subject}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={`${inputClass} cursor-not-allowed`}
                required
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {campagin.campaign_list_individual ? null : (
              <FormControl sx={{ width: "100%" }}>
                <FormLabel>Group Name</FormLabel>
                <Select
                  labelId="demo-group-name-label"
                  id="demo-group-name"
                  multiple
                  name="campaign_list_group"
                  value={campagin.campaign_list_group}
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
            )}
            <div>
              {campagin.campaign_list_group.length > 0 ? null : (
                <SelectInput
                  label="Contact Individual"
                  options={email.map((item) => ({
                    value: item.contact_email,
                    label: item.contact_email,
                  }))}
                  // required
                  value={campagin.campaign_list_individual || ""}
                  name="campaign_list_individual"
                  onChange={(e) => onInputChange(e.target.name, e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="col-span-1">
              <FormLabel>Holiday</FormLabel>

              <FormControlLabel
                control={
                  <Checkbox
                    value={campagin.campaign_list_holiday || ""}
                    name="campaign_list_holiday"
                    size="large"
                    checked={checkboxChecked}
                    onChange={handleCheckboxChange}
                  />
                }
              />
            </div>

            <div className="col-span-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormLabel required> Campagin Start Date</FormLabel>

                <DatePicker
                  value={campagin.campaign_list_date}
                  name="campaign_list_date"
                  onChange={(newValue) =>
                    onInputChange("campaign_list_date", newValue)
                  }
                  format="DD-MM-YYYY"
                  shouldDisableDate={
                    checkboxChecked ? undefined : isDateDisabled
                  }
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
                />
              </LocalizationProvider>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <Button
              className="w-36 text-white bg-blue-600"
              type="submit"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Submitting..." : "Submit"}
            </Button>
            <Button
              className="w-36 text-white bg-red-600"
              onClick={() => navigate("/campaigns")}
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
