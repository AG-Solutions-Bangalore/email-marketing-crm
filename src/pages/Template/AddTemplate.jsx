import React, { useState } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { IconInfoCircle } from "@tabler/icons-react";
import toast from "react-hot-toast";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-html";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/theme-dracula";
// import "ace-builds/src-noconflict/ext-language_tools";
// import "ace-builds/src-noconflict/snippets/html";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "ckeditor4-react";

const AddTemplate = () => {
  const [template, setTemplate] = useState({
    template_name: "",
    template_design: "", // For HTML content
    template_subject: "",
    template_url: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const onInputChange = (name, value) => {
    setTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        template_design: "",
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
  console.log(template.template_design, "template");
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

            <CKEditor
              initData="<p>Fill the Content Here</p>"
              config={{
                versionCheck: false,
              }}
              value={template.template_design}
              onChange={(event) => {
                console.log(event);
                onInputChange("template_design", event.editor.getData());
              }}
            />
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

          .editor-wrapper {
            min-height: 200px;
          }

          
        `}
      </style>
    </Layout>
  );
};

export default AddTemplate;
