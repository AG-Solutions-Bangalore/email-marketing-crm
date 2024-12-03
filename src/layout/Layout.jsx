import { styled, Container, Box } from "@mui/material";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import React from "react";
import Footer from "../components/Footer";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  padding: "20px",
}));

const PageWrapper = styled("div")(({ isCollapsed }) => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  backgroundColor: "transparent",
  // marginLeft: isCollapsed ? "60px" : "240px", // Adjust margin-left dynamically
  transition: "margin-left 0.3s ease-in-out", // Smoother, more efficient transition for margin-left
}));

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle collapsed state
  };

  return (
    <MainWrapper className="mainwrapper bg-[#F0F5F9]">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
      />

      {/* Main Wrapper */}
      <PageWrapper
        className="page-wrapper max-w-full"
        isCollapsed={isCollapsed}
      >
        {/* PageContent */}
        <Container
          sx={{
            maxWidth: "100% !important",
            px: "10px !important",
            mx: "10px !important",
          }}
        >
          {/* Header */}
          <Header
            toggleSidebar={toggleSidebar}
            toggleMobileSidebar={() => setMobileSidebarOpen(true)}
          />

          {/* Page Route */}
          <Box sx={{ minHeight: "calc(100vh - 170px)", py: 3 }}>{children}</Box>
        </Container>

        <div className="pl-5 ">
          <Footer />
        </div>
      </PageWrapper>
    </MainWrapper>
  );
};

export default Layout;
