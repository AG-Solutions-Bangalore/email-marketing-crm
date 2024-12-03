import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import toast from "react-hot-toast";
import { Button } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import SelectInput from "../../../components/common/SelectInput";
const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];
const EditGroup = () => {
  const [group, setGroup] = useState({
    group_name: "",
    group_status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const onInputChange = (name, value) => {
    setGroup({ ...group, [name]: value });
  };
  const fetchGroupData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/panel-fetch-group-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroup(response.data?.group || []);
    } catch (error) {
      console.error("Error fetching template data:", error);
    }
  };

  useEffect(() => {
    fetchGroupData();
  }, [id]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);

    const data = {
      group_name: group.group_name,
      group_status: group.group_status,
    };

    try {
      await axios.put(`${BASE_URL}/panel-update-group/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Group added successfully!");
      navigate("/group");
      setGroup({
        group_name: "",
      });
    } catch (error) {
      toast.error("Error adding group!");
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

  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-4 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-black text-lg flex items-center gap-2">
            Edit Group
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
                name="group_name"
                value={group.group_name}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="form-group ">
              <SelectInput
                label="Status"
                options={status.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
                required
                value={group.group_status}
                name="group_status"
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                placeholder="Select  Status"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <Button
              className="w-36 text-white bg-blue-600"
              type="submit"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Updatting..." : "Update"}
            </Button>
            <Button
              className="w-36 text-white bg-red-600"
              onClick={() => navigate("/group")}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditGroup;
