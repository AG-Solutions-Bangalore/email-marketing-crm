import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { Center, Loader, Text, Modal, Button, TextInput } from "@mantine/core";
import moment from "moment";
import { IconTrash } from "@tabler/icons-react";
import { FormLabel } from "@mui/material";
import toast from "react-hot-toast";

const DashboardCard = ({ date, onDelete }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm relative group">
    <div className="p-6 border-b border-gray-100">
      <div className="text-center">
        <p className="text-xl font-bold text-gray-900">
          {moment(date).format("Do, MMMM YYYY")}
        </p>
      </div>
    </div>
    <button
      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
      onClick={onDelete}
    >
      <IconTrash size={20} />
    </button>
  </div>
);

const Holiday = () => {
  const [result, setResult] = useState([]);
  const [loadingDashboardData, setLoadingDashboardData] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHolidayDate, setNewHolidayDate] = useState("");

  const fetchResult = async () => {
    setLoadingDashboardData(true);
    try {
      const response = await axios.get(`${BASE_URL}/panel-fetch-holiday-list`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200 && response.data.holiday) {
        setResult(response.data.holiday);
      }
    } catch (error) {
      console.error("Error fetching holiday data:", error);
    } finally {
      setLoadingDashboardData(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/panel-delete-holiday/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsDeleteModalOpen(false);
      fetchResult();
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const handleAddHoliday = async () => {
    const data = { holiday_date: newHolidayDate };
    try {
      await axios.post(
        `${BASE_URL}/panel-create-holiday
`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Holiday Created Sucesfully");
      setIsAddModalOpen(false);
      setNewHolidayDate("");
      fetchResult();
    } catch (error) {
      console.error("Failed to add holiday:", error);
      toast.error("Failed to add holiday");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchResult();
  }, []);
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
      <div className="bg-gray-100">
        {loadingDashboardData ? (
          <Center style={{ height: "70vh", flexDirection: "column" }}>
            <Loader size="lg" variant="dots" color="blue" />
            <Text mt="md" color="gray" size="lg">
              Loading, please wait...
            </Text>
          </Center>
        ) : (
          <>
            <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA] flex justify-between items-center">
              <h2 className="text-black text-lg flex items-center gap-2 px-5 p-2">
                Holiday
              </h2>
              <div>
                <Button
                  className="w-32 sm:w-36 text-white bg-blue-600 hover:bg-violet-400 hover:animate-pulse"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {result.map((holiday) => (
                <DashboardCard
                  key={holiday.id}
                  date={holiday.holiday_date}
                  onDelete={() => confirmDelete(holiday.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Confirmation Modal */}
        <Modal
          opened={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Deletion"
          centered
        >
          <Text>Are you sure you want to delete this holiday?</Text>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              className="hover:bg-green-500 hover:text-white"
              color="gray"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              No
            </Button>
            <Button
              color="red"
              variant="outline"
              className="hover:bg-red-500 hover:text-white"
              onClick={handleDelete}
            >
              Yes, Delete
            </Button>
          </div>
        </Modal>

        {/* Add Holiday Modal */}
        <Modal
          opened={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Holiday"
          centered
        >
          <div>
            <FormLabel required> Holiday Date</FormLabel>
            <input
              type="date"
              name="newHolidayDate"
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              className="hover:bg-red-500 hover:text-white"
              color="gray"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-green-700"
              onClick={handleAddHoliday}
            >
              Submit
            </Button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Holiday;
