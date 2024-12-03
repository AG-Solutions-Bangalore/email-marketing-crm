import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { IconInfoCircle } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const AddTemplate = () => {
  const [template, setTemplate] = useState({
    template_name: "",
    template_design: "",
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

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      template_design: data,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
    <label className="block text-sm font-semibold text-black mb-1 ">
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

        {/* <form
          id="dowRecp"
          autoComplete="off"
          onSubmit={onSubmit}
          className="w-full max-w-7xl rounded-lg mx-auto p-6 space-y-8"
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
                name="template_subject"
                type="text"
                required
                value={template.template_subject}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 "
              />
            </div>
            <div>
              <FormLabel required>Template URL</FormLabel>
              <input
                name="template_url"
                value={template.template_url}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                type="text"
                required
                className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500 "
              />
            </div>
          </div>
          <div className="h-30 w-full">
            <FormLabel required>Template Design</FormLabel>
            <CKEditor
              editor={ClassicEditor}
              data={template.template_design}
              onChange={handleEditorChange}
              name="template_design"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <Button
              className="w-36 text-white bg-blue-600 !important hover:bg-violet-400 hover:animate-pulse"
              type="submit"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Submitting..." : "Submit"}
            </Button>
            <Button
              className="w-36 text-white bg-red-600 !important hover:bg-violet-400 hover:animate-pulse"
              onClick={() => {
                navigate("/templates");
              }}
            >
              Back{" "}
            </Button>
          </div>
        </form> */}
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
              <FormLabel required>Template URL</FormLabel>
              <input
                type="text"
                name="template_url"
                value={template.template_url}
                onChange={(e) => onInputChange(e.target.name, e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div className="editor-container">
            <FormLabel required>Template Design</FormLabel>
            <CKEditor
              editor={ClassicEditor}
              data={template.template_design || ""}
              onChange={handleEditorChange}
              name="template_design"
              config={{
                toolbar: {
                  shouldNotGroupWhenFull: true,
                },
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <Button
              className="w-36 text-white bg-blue-600"
              type="submit"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "SUbmitting..." : "Submit"}
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
          .editor-container .ck-editor__editable {
            min-height: 20rem;
            max-height: 40rem;
            overflow-y: auto;
            overflow-x: auto;
          }
          @media (max-width: 768px) {
            .editor-container .ck-editor__editable {
              min-height: 15rem;
              max-height: 30rem;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default AddTemplate;
