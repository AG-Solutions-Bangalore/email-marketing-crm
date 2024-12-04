import { Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import toast, { Toaster } from "react-hot-toast";
import Logo1 from "../../assets/receipt/ag_logo.png";
import { FaInstagram, FaPinterest, FaTwitter } from "react-icons/fa";
import { TiSocialLinkedin, TiSocialYoutubeCircular } from "react-icons/ti";
import { CgFacebook } from "react-icons/cg";
import { FormLabel } from "@mui/material";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  // Input field class for styling
  const inputClass =
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";

  // Helper function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await axios.post(`${BASE_URL}/panel-login`, formData);
      console.log(res);
      if (res.status === 200) {
        const token = res.data.UserInfo?.token;

        // Store user information in localStorage
        localStorage.setItem("id", res.data.UserInfo.user.id);
        localStorage.setItem("username", res.data.UserInfo.user.name);
        localStorage.setItem("user_type_id", res.data.UserInfo.user.user_type);
        localStorage.setItem("email", res.data.UserInfo.user.email);

        if (token) {
          localStorage.setItem("token", token);
          navigate("/home");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };

  // Handle forgotten password redirection
  const handleForgetPasswordClick = () => {
    navigate("/forget-password");
  };

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
          {/* Logo Section */}
          <div className="text-center mb-6">
            <img src={Logo1} alt="Company Logo" className="w-70 h-24 mx-auto" />
          </div>

          {/* Title */}
          <Typography
            variant="h4"
            className="text-center font-bold mb-4 text-blue-gray-800"
          >
            Sign into Your Account
          </Typography>

          {/* Login Form */}
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
              <FormLabel required>Enter Your Email</FormLabel>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <FormLabel required>Password</FormLabel>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                type="submit"
                disabled={loading}
              >
                {loading ? "Checking..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Forgot Password Link */}
          <div className="text-right mt-4">
            <Link
              className="text-sm text-gray-700 hover:text-blue-600"
              to="/forget-password"
            >
              Forgot password?
            </Link>
          </div>

          {/* Social Media Links */}
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
    </>
  );
};

export default SignIn;
