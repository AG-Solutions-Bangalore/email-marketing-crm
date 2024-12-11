import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { IconInfoCircle } from "@tabler/icons-react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css";
import { Button } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import SelectInput from "../../components/common/SelectInput";
import { CKEditor } from "ckeditor4-react";

const status = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditTemplate = () => {
  const [template, setTemplate] = useState({
    template_name: "",
    template_design: "",
    template_subject: "",
    template_url: "",
    template_status: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [fetchtemplatedata, setFetchTemplateData] = useState(false);
  const getTemplateData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/panel-fetch-template-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFetchTemplateData(true);
      if (res.data?.template) {
        setTemplate(res.data.template);
      } else {
        throw new Error("Template data is missing");
      }
    } catch (error) {
      console.error("Failed to fetch template:", error);
      toast.error("Failed to load template data");
      setFetchTemplateData(false);
    }
  };
  useEffect(() => {
    getTemplateData();
  }, [id]);

  const onInputChange = (name, value) => {
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!template.template_design.trim()) {
      toast.error("Template Design cannot be empty!");
      return;
    }
    setIsButtonDisabled(true);
    const data = {
      template_name: template.template_name,
      template_subject: template.template_subject,
      template_design: template.template_design,
      template_url: template.template_url,
      template_status: template.template_status,
    };
    try {
      await axios.put(`${BASE_URL}/panel-update-template/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Template Updated Successfully");
      navigate("/templates");
    } catch (error) {
      toast.error("Error updating template");
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
      <div className="bg-white p-4 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-green-500 bg-[#E1F5FA] rounded-lg">
          <h2 className="px-5 text-black text-lg flex items-center gap-2">
            <IconInfoCircle className="w-4 h-4" />
            Template Edit
          </h2>
        </div>
        <form
          autoComplete="off"
          onSubmit={onSubmit}
          className="w-full max-w-7xl mx-auto p-6 space-y-8"
        >
          <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <SelectInput
                label="Status"
                options={status}
                required
                value={template.template_status || ""}
                name="template_status"
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
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
            {fetchtemplatedata && (
              <CKEditor
                initData={template.template_design}
                name="template_design"
                value={template.template_design}
                onChange={(event) => {
                  const editorData = event.editor.getData();
                  onInputChange("template_design", editorData);
                }}
                config={{
                  versionCheck: false,
                }}
              />
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <Button
              className="w-36 text-white bg-blue-600"
              type="submit"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Updating..." : "Update"}
            </Button>
            <Button
              className="w-36 text-white bg-red-600"
              onClick={() => navigate("/templates")}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
      <style>
        {`
          .editor-container .ql-editor {
            min-height: 20rem;
            max-height: 40rem;
            overflow-y: auto;
            overflow-x: auto;
          }
          @media (max-width: 768px) {
            .editor-container .ql-editor {
              min-height: 15rem;
              max-height: 30rem;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default EditTemplate;
