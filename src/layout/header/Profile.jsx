import React, { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
} from "@mui/material";
import { Button } from "@mantine/core";

import { useNavigate } from "react-router-dom";

import { IconMail, IconUser, IconCircleX } from "@tabler/icons-react";
import Logout from "../../components/Logout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import toast from "react-hot-toast";
import SelectInput from "../../components/common/SelectInput";
import { IconSettings } from "@tabler/icons-react";
const Profile = () => {
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenLogout = () => setOpenModal(!openModal);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);

  const [state, setState] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    state: "",
    pincode: "",
  });
  const [password, setPassword] = useState({
    username: "",
    password: "",
    old_password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };
  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPassword((prevPassword) => ({
      ...prevPassword,
      [name]: value,
    }));
  };
  const getData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/panel-fetch-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("API response:", res.data);
      setProfile(res.data.profile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    }
  };
  const getStateData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/panel-fetch-state`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setState(res.data.state || []);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };
  const onUpdateProfile = async (e) => {
    e.preventDefault();

    setIsButtonDisabled(true);

    const data = {
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      address: profile.address,
      state: profile.state,
      pincode: profile.pincode,
    };

    try {
      const res = await axios.post(`${BASE_URL}/panel-update-profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        // console.log(res.status, "satus");
        // console.log("start");
        toast.success("Profile Updated Successfully!");
        // console.log("end");

        handleClose();
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile not Updated");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();

    const data = {
      old_password: password.old_password,
      password: password.password,
      username: localStorage.getItem("email"),
    };

    try {
      await axios.post(`${BASE_URL}/panel-change-password`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Password Updated Successfully!");
      setOpenDialog1(false);
      setPassword({
        password: "",
        old_password: "",
      });
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Please enter valid old password");
    }
  };
  const handleClose = () => {
    setOpenDialog(false);
    setAnchorEl2(null);
  };
  const handleClose1 = () => {
    setOpenDialog1(false);
    setAnchorEl2(null);
  };

  const handleopen = () => {
    setOpenDialog(true);
    getData();
    getStateData();
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
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
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src="/src/assets/profile/user_1.png"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem onClick={handleopen}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setOpenDialog1(true)}>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate("/setting")}>
          <ListItemIcon>
            <IconSettings width={20} />
          </ListItemIcon>
          <ListItemText>Setting</ListItemText>
        </MenuItem>

        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleOpenLogout}
            className="text-center text-sm font-[400] cursor-pointer rounded-full text-black border-[1px] border-blue-300 hover:bg-red-600 hover:text-white"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
      {/*........................................... //Profile ......................................................*/}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(5px) sepia(5%)",
          "& .MuiDialog-paper": {
            borderRadius: "18px",
          },
        }}
      >
        <form autoComplete="off" onSubmit={onUpdateProfile}>
          <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-slate-800 text-xl font-semibold">
                  Personal Details
                </h1>

                <div className="flex " onClick={handleClose}>
                  <Tooltip title="Close">
                    <button type="button" className="ml-3 pl-2">
                      <IconCircleX />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2 p-4 ">
                <div className="grid grid-cols-2  gap-6 mb-4">
                  <div>
                    <FormLabel required>Full Name</FormLabel>
                    <input
                      required
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FormLabel required>Phone</FormLabel>
                    <input
                      required
                      maxLength={10}
                      name="mobile"
                      value={profile.mobile}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <FormLabel required>Address</FormLabel>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    rows="3"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2  gap-6 my-4">
                  <div>
                    <SelectInput
                      label="State"
                      options={state.map((item) => ({
                        value: item.state_name,
                        label: item.state_name,
                      }))}
                      required
                      value={profile.state || ""}
                      name="state"
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>

                  <div>
                    <FormLabel required>Pincode</FormLabel>
                    <input
                      name="pincode"
                      type="tel"
                      maxLength={6}
                      value={profile.pincode}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
                <div>
                  <FormLabel required>Email</FormLabel>
                  <input
                    required
                    name="email"
                    value={profile.email}
                    disabled
                    onChange={handleChange}
                    className=" cursor-not-allowed w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-green-500"
                  />
                </div>

                <div className="mt-5 flex justify-center">
                  <Button
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 h-15 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                    disabled={isButtonDisabled}
                    type="submit"
                  >
                    {isButtonDisabled ? "updating..." : "Update Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
      {/*........................................... //chnage password ......................................................*/}
      <Dialog
        open={openDialog1}
        onClose={() => setOpenDialog1(false)}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(5px) sepia(5%)",
          "& .MuiDialog-paper": {
            borderRadius: "18px",
          },
        }}
      >
        <form autoComplete="off" onSubmit={onChangePassword}>
          <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-slate-800 text-xl font-semibold">
                  Change Password
                </h1>

                <div className="flex " onClick={handleClose1}>
                  <Tooltip title="Close">
                    <button type="button" className="ml-3 pl-2">
                      <IconCircleX />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2 p-4 ">
                <div className="grid grid-cols-1  gap-6 mb-4">
                  <div>
                    <FormLabel required>Old Password</FormLabel>
                    <input
                      required
                      type="password"
                      name="old_password"
                      value={password.old_password}
                      onChange={handleChangePassword}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FormLabel required>New Password</FormLabel>
                    <input
                      required
                      type="password"
                      name="password"
                      value={password.password}
                      onChange={handleChangePassword}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-center">
                  <Button
                    className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 h-15 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md mr-2"
                    disabled={isButtonDisabled}
                    type="submit"
                  >
                    {isButtonDisabled ? "Change..." : "Change Password"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profile;
