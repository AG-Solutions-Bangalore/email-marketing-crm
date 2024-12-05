import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import toast from "react-hot-toast";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import contactImportImage from "../../../assets/profile/contact-import.png"; // Importing the image

const ContactImport = () => {
  const [file, setFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a valid .csv file!");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("No file selected!");
      return;
    }
    setIsButtonDisabled(true);

    const formData = new FormData();
    formData.append("uploaded_file", file);

    try {
      await axios.post(`${BASE_URL}/panel-import-contact`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Contact imported successfully!");
      navigate("/Contact");
      setFile(null);
    } catch (error) {
      toast.error("Error importing contacts!");
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

  const downloadFile = () => {
    const csvContent = `Group Name,Contact Name,Email,Mobile,Address,State,Pincode
Test BBC,Rohit,testaaa@gmail.com,7852585285,"3rd Cross 4th Main Bangalore",Karnataka,564000
    `.trim();

    const encodedUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;

    const link = document.createElement("a");
    link.href = encodedUri;
    link.setAttribute("download", "data_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputClass = `w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500 ${isButtonDisabled ? "bg-gray-200 cursor-not-allowed" : ""}`;

  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-4 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-black text-lg flex items-center gap-2">
            Contact Import
          </h2>
        </div>
        <form
          autoComplete="off"
          onSubmit={onSubmit}
          className="w-full max-w-7xl mx-auto p-6 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <FormLabel required>Upload CSV</FormLabel>
              <input
                type="file"
                onChange={handleFileChange}
                className={inputClass}
                required
                accept=".csv"
                disabled={isButtonDisabled}
              />
            </div>

            <div className="flex justify-center">
              <div>
                <img
                  src={contactImportImage}
                  alt="Contact Import"
                  className="w-full h-auto"
                />
                <h3
                  className="text-blue-900 hover:text-red-600 cursor-pointer"
                  onClick={downloadFile}
                >
                  Download Data Sample Format
                </h3>
                ( While Uploading remove the heading in the Excel File )
              </div>
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

export default ContactImport;
