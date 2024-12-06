import React, { useState } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { IconInfoCircle } from "@tabler/icons-react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const AddTemplate = () => {
  const [template, setTemplate] = useState({
    template_name: "",
    template_design: "", // For HTML content
    template_subject: "",
    template_url: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isHtmlView, setIsHtmlView] = useState(false); // State for toggling HTML view
  const navigate = useNavigate();

  const onInputChange = (name, value) => {
    setTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);

    const data = {
      template_name: template.template_name,
      template_subject: template.template_subject,
      template_design: template.template_design, // Already in HTML
      template_url: template.template_url,
    };

    try {
      await axios.post(`${BASE_URL}/panel-create-template`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Template Created Successfully");
      navigate("/templates");
      setTemplate({
        template_name: "",
        template_subject: "",
        template_design: "", // Reset HTML content
        template_url: "",
      });
    } catch (error) {
      toast.error("Error creating template");
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
      <div className="bg-[#FFFFFF] p-2 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Template Add</span>
            </div>
          </h2>
        </div>
        <hr />

        <form
          autoComplete="off"
          onSubmit={onSubmit}
          className="w-full max-w-7xl mx-auto p-6 space-y-8"
        >
          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <FormLabel required>Template Name</FormLabel>
              <input
                type="text"
                name="template_name"
                value={template.template_name}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <FormLabel required>Subject</FormLabel>
              <input
                type="text"
                name="template_subject"
                value={template.template_subject}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel>Template URL</FormLabel>
              <input
                type="text"
                name="template_url"
                value={template.template_url}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="editor-container">
            <FormLabel required>Template Design</FormLabel>

            {/* Toggle HTML View or ReactQuill Editor */}
            <Button
              onClick={() => setIsHtmlView(!isHtmlView)}
              className="mb-4 text-white bg-blue-600"
            >
              {isHtmlView ? "Switch to Editor" : "Switch to HTML View"}
            </Button>

            {isHtmlView ? (
              // Allow copy-pasting HTML content in the textarea
              <div
                className="p-4 bg-gray-100 border rounded"
                style={{
                  minHeight: "200px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap", // Ensures whitespace is respected
                  wordBreak: "break-word", // Breaks long words to avoid overflow
                }}
              >
                <textarea
                  value={template.template_design}
                  onChange={(e) =>
                    setTemplate((prev) => ({
                      ...prev,
                      template_design: e.target.value,
                    }))
                  }
                  placeholder="Paste your HTML code here"
                  className="w-full h-full bg-gray-100 p-2 border rounded"
                  style={{ minHeight: "200px" }}
                />
              </div>
            ) : (
              // Use ReactQuill for editing
              <ReactQuill
                theme="snow"
                value={template.template_design}
                onChange={(content) =>
                  setTemplate((prev) => ({ ...prev, template_design: content }))
                }
                className="editor"
                placeholder="Type your content here..."
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <Button
              className="w-full sm:w-36 text-white bg-blue-600"
              type="submit"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Submitting..." : "Submit"}
            </Button>
            <Button
              className="w-full sm:w-36 text-white bg-red-600"
              onClick={() => navigate("/templates")}
            >
              Back
            </Button>
          </div>
        </form>
      </div>

      <style>
        {`
          .editor {
            border: 1px solid #ced4da;
            border-radius: 4px;
          }
        `}
      </style>
    </Layout>
  );
};

export default AddTemplate;
