import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userTypeId = localStorage.getItem("user_type_id");
  const [currentYear, setCurrentYear] = useState("");

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/panel-check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  // useEffect(() => {
  //   const fetchYearData = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/fetch-year`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });
  //       setCurrentYear(response.data?.year?.current_year || "");
  //     } catch (error) {
  //       console.error("Error fetching year data:", error);
  //     }
  //   };
  //   fetchYearData();
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPath = [
          "/home",
          //template
          "/templates",
          "/templates/add",
          "/campaigns",
          "/campaigns/add",
          "/campaigns/view",
          "/report/read",
          "/report/unsubscribe",
          "/report/visted",
          "/report/campaign",
          "/Contact",
          "/Contact/edit",
          "/group",
          "/group/add",
          "/group/edit",
          "/developer",
          "/test",
        ];

        const isAllowedPath = allowedPath.some((path) =>
          currentPath.startsWith(path)
        );
        if (isAllowedPath) {
          navigate(currentPath + location.search);
        } else {
          navigate("/home");
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/register" ||
          currentPath === "/forget-password" ||
          currentPath === "/sign-up-page"
        ) {
          navigate(currentPath);
        } else {
          navigate("/"); // Redirect to login if no token
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider
      value={{ isPanelUp, setIsPanelUp, userTypeId, currentYear }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
