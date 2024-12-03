import { Input, Button, Typography } from "@material-tailwind/react";
import toast, { Toaster } from "react-hot-toast";
import BASE_URL from "../../base/BaseUrl";
import { useState } from "react";
import Logo1 from "../../assets/receipt/ag_logo.png";
import { FaInstagram, FaPinterest, FaTwitter } from "react-icons/fa";
import { TiSocialLinkedin, TiSocialYoutubeCircular } from "react-icons/ti";
import { CgFacebook } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { FormLabel } from "@mui/material";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onResetPassword = async (e) => {
    e.preventDefault();
    const data = { email: email };

    try {
      const response = await fetch(`${BASE_URL}/panel-send-password`, {
        method: "POST",

        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.Status === "200") {
        toast.success("New Password Sent to your Email");
      } else {
        toast.error("Email not sent. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred.");
      console.error("Error:", error); // Optional: Log the error for debugging
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";

  return (
    <>
      <Toaster
        toastOptions={{
          success: { style: { background: "green" } },
          error: { style: { background: "red" } },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
          <div className="flex items-center justify-center mb-8">
            <img src={Logo1} alt="Company Logo" className="w-70 h-24 mx-auto" />
          </div>
          <Typography
            variant="h4"
            className="text-center font-bold mb-6 text-blue-gray-800"
          >
            Enter your email to reset your password.
          </Typography>
          <form onSubmit={onResetPassword} className="space-y-6">
            {/* <div>
              <FormLabel required>Username</FormLabel>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClass}
                required
              />
            </div> */}
            <div>
              <FormLabel required>Email</FormLabel>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="flex justify-center ">
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                type="submit"
              >
                {" "}
                Reset Password
              </button>
            </div>
          </form>
          <div className="text-end mt-4" onClick={() => navigate("/")}>
            <Link className="text-sm text-gray-700 hover:text-blue-600">
              Sign In
            </Link>
          </div>

          <div>
            <div className="mt-6">
              <h6 className="text-center text-gray-600">Follow Us</h6>
              <div className="flex justify-center space-x-4 mt-4">
                <CgFacebook className="text-black hover:bg-blue-700 cursor-pointer hover:text-white p-2 rounded-full w-10 h-10" />
                <TiSocialYoutubeCircular className="text-black hover:bg-red-500 hover:text-white p-2 rounded-full w-10 h-10" />
                <FaTwitter className="text-black hover:bg-blue-500 hover:text-white p-2 rounded-full w-10 h-10" />
                <TiSocialLinkedin className="text-black hover:bg-blue-500 hover:text-white p-2 rounded-full w-10 h-10" />
                <FaInstagram className="text-black hover:bg-yellow-800 hover:text-white p-2 rounded-full w-10 h-10" />
                <FaPinterest className="text-black hover:bg-red-500 hover:text-white p-2 rounded-full w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
