import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ForgetPassword from "./pages/auth/ForgetPassword";
import { Toaster } from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";
import Template from "./pages/Template/Template";
import Campagin from "./pages/Campagin/Campagin";
import ReportUnsubscribe from "./pages/Report/ReportUnsubscribe/ReportUnsubscribe";
import ReportVisted from "./pages/Report/ReportVisited/ReportVisted";
import ReportCampagin from "./pages/Report/ReportCampagin/ReportCampagin";
import AddTemplate from "./pages/Template/AddTemplate";
import EditTemplate from "./pages/Template/EditTemplate";
import Contact from "./pages/Contact/Contact/Contact";
import AddContact from "./pages/Contact/Contact/AddContact";
import EditContact from "./pages/Contact/Contact/EditContact";
import Group from "./pages/Contact/Group/Group";
import AddGroup from "./pages/Contact/Group/AddGroup";
import EditGroup from "./pages/Contact/Group/EditGroup";
import ContactImport from "./pages/Contact/Contact/ContactImport";
import AddCampagin from "./pages/Campagin/AddCampaign";
import Developer from "./pages/Developer/Developer";
import ReportReadForm from "./pages/Report/ReportRead/ReportReadForm";
import CampaginIndivialView from "./pages/Campagin/CampaginIndivialView";
import Setting from "./pages/Setting/Setting";
import ReportReadView from "./pages/Report/ReportRead/ReportView";
import ReportCampaginView from "./pages/Report/ReportCampagin/ReportCampaginView";
import ReportVisitedView from "./pages/Report/ReportVisited/ReportVisitedView";
const App = () => {
  return (
    <>
      <Toaster
        toastOptions={{
          success: { style: { background: "#10B981", color: "#fff" } },
          error: { style: { background: "#EF4444", color: "#fff" } },
        }}
        position="top-right"
        reverseOrder={false}
      />

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/maintenance" element={<Maintenance />} />
        {/* //EMAIL MARKETING/////// */}

        <Route path="/templates" element={<Template />} />

        <Route path="/templates/add" element={<AddTemplate />} />
        <Route path="/templates/edit/:id" element={<EditTemplate />} />
        <Route path="/campaigns" element={<Campagin />} />
        <Route path="/campaigns/add" element={<AddCampagin />} />
        <Route path="/campaigns/view/:id" element={<CampaginIndivialView />} />
        <Route path="/report/read" element={<ReportReadForm />} />
        <Route path="/report/view" element={<ReportReadView />} />
        <Route path="/report/unsubscribe" element={<ReportUnsubscribe />} />

        <Route path="/report/visted" element={<ReportVisted/>} />
        <Route path="/report/visted/view" element={<ReportVisitedView />} />
        <Route path="/report/campaign" element={<ReportCampagin />} />
        <Route path="/report/campaign/view" element={<ReportCampaginView />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Contact/add" element={<AddContact />} />
        <Route path="/Contact/edit/:id" element={<EditContact />} />
        <Route path="/Contact/import" element={<ContactImport />} />

        {/* //group */}

        <Route path="/group" element={<Group />} />
        <Route path="/group/add" element={<AddGroup />} />
        <Route path="/group/edit/:id" element={<EditGroup />} />
        {/* //Developer */}
        <Route path="/developer" element={<Developer />} />

        {/* //setting */}
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </>
  );
};

export default App;
