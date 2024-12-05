import React from "react";
import Layout from "../../layout/Layout";
import logo from "../../../public/user_1.png";
const Developer = () => {
  return (
    <Layout>
      <div className="max-w-screen p-4 md:p-6">
        {/* Main Container */}
        <div className="border rounded-lg p-4 md:p-6 shadow-lg bg-white">
          {/* Header */}
          <h2 className="text-lg md:text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
            Developer
          </h2>

          {/* Logo and Content Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
            {/* Logo Section */}
            <div className="text-center md:text-left">
              <img
                src={logo}
                alt="Developer Logo"
                className="w-32 md:w-48 lg:w-64 mx-auto md:mx-0 rounded-lg"
              />
            </div>
            {/* Content Section */}
            <div>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold">
                AG Solution
              </h3>
              <h2 className="text-lg md:text-xl font-semibold mt-2">
                Single Click Solution
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-2">
                Jayanagara 9th Block, Bengaluru, 560069
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="border rounded-lg p-4 text-center shadow hover:shadow-lg transition">
              <h4 className="text-sm md:text-base font-semibold text-gray-700">
                Email
              </h4>
              {/* <h4 className="text-sm md:text-base font-semibold text-gray-700 flex items-center justify-center">
                <IconMail className="mr-2 text-blue-500" />
              </h4> */}
              <p className="text-xs md:text-sm text-blue-500 mt-2">
                <a
                  href="mailto:info@ag-solution.in"
                  className="hover:underline"
                >
                  info@ag-solution.in
                </a>
              </p>
            </div>
            {/* WhatsApp */}
            <div className="border rounded-lg p-4 text-center shadow hover:shadow-lg transition">
              <h4 className="text-sm md:text-base font-semibold text-gray-700">
                WhatsApp
              </h4>
              {/* <h4 className="text-sm md:text-base font-semibold text-gray-700 flex items-center justify-center">
                <IconBrandWhatsapp className="mr-2 text-blue-500" />
              </h4> */}
              <p className="text-xs md:text-sm text-blue-500 mt-2">
                <a
                  href="https://wa.me/8867171060"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  8867171060
                </a>
              </p>
            </div>
            {/* Website */}
            <div className="border rounded-lg p-4 text-center shadow hover:shadow-lg transition">
              <h4 className="text-sm md:text-base font-semibold text-gray-700">
                Website
              </h4>
              {/* <h4 className="text-sm md:text-base font-semibold text-gray-700 flex items-center justify-center">
                <img
                  src={logo}
                  alt="Developer Logo"
                  className="w-8 mx-auto md:mx-0 rounded-lg"
                />
              </h4> */}
              <p className="text-xs md:text-sm text-blue-500 mt-2">
                <a
                  href="https://www.ag-solutions.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  ag-solutions.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Developer;
