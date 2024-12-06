import BASE_URL from "../../../base/BaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  IconArrowBarLeft,
  IconFileTypePdf,
  IconFileTypeXls,
  IconPrinter,
} from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
const Table_Head = [
  { label: "Campagin Date" },
  { label: "Campagin Subject" },
  { label: "Contact Name" },
  { label: "Contact Mail" },
  { label: "Contact Mobile" },
];

function ReportVisitedView() {
  const [invoicesSub, setInvoicesSub] = useState([]);
  const componentRef = useRef();
  const tableRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const campaignData = location.state?.ReadData;
    if (campaignData) {
      console.log("Received campaign data", campaignData);
      setInvoicesSub(campaignData);
    } else {
      console.log("No campaign data found.");
    }
  }, [location]);
  const handleSavePDF = () => {
    const input = tableRef.current;

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const margin = 0;

        const availableWidth = pdfWidth - 2 * margin;

        const ratio = Math.min(
          availableWidth / imgWidth,
          pdfHeight / imgHeight
        );

        const imgX = margin;
        const imgY = 0;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );
        pdf.save("invoice.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };

  const mergeRefs =
    (...refs) =>
    (node) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      });
    };
  const ReadData1 = localStorage.getItem("ReadData1");
  const ReadData2 = localStorage.getItem("ReadData2");
  const handleExport = async () => {
    const data = {
      from_date: ReadData1,
      to_date: ReadData2,
    };
    try {
      const token = localStorage.getItem("token");
      const response = await axios({
        url: `${BASE_URL}/panel-download-visited-report`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Visted_list.csv");
      document.body.appendChild(link);
      link.click();

      toast.success("Visted list exported successfully!");
    } catch (error) {
      toast.error("Failed to export Visted list.");
      console.error("Export error:", error);
    }
  };
  return (
    <Layout>
      <div className="mt-3">
        <div className="flex  md:flex-row justify-between items-center  p-4 space-y-4 md:space-y-0">
          <div className="w-full md:w-auto font-bold flex">
            <IconArrowBarLeft
              className="mr-2 align-center cursor-pointer"
              onClick={() => {
                navigate("/report/visted");
              }}
            />
            Report Visted View
          </div>
          {/* className="flex sm:justify-between md:flex-row items-center space-x-4 md:space-y-0 md:space-x-4 w-full md:w-auto" */}
          <div className="flex flex-row space-x-4">
            <button
              variant="text"
              className="flex items-center space-x-2"
              onClick={handleSavePDF}
            >
              <IconFileTypePdf />
              <span className="hidden sm:inline">Download</span>{" "}
            </button>

            <button
              variant="text"
              className="flex items-center space-x-2"
              onClick={handleExport}
            >
              <IconFileTypeXls />
              <span className="hidden sm:inline">Download</span>{" "}
            </button>

            <ReactToPrint
              trigger={() => (
                <button variant="text" className="flex items-center space-x-2">
                  <IconPrinter />
                  <span className="hidden sm:inline">Print Receipt</span>
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>
        </div>

        <div
          className="flex flex-col items-center  min-h-screen  p-4 bg-white "
          ref={mergeRefs(componentRef, tableRef)}
        >
          <h2 className="font-bold"> Report Visted View</h2>
          <div className="w-full   p-4 ">
            <TableContainer
              component={Paper}
              elevation={0}
              className="shadow-none"
              sx={{
                maxHeight: "calc(100vh - 150px)",
                overflowX: "auto",
              }}
            >
              <Table className="table-auto border-collapse border border-gray-300">
                <TableHead className="bg-gray-100">
                  <TableRow>
                    {Table_Head.map((group, index) => (
                      <TableCell
                        key={index}
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          borderBottom: "2px solid #ddd",
                        }}
                      >
                        {group.label || "No Label"}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoicesSub.map((invoice, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#f9f9f9",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {moment(invoice.campaign_date).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {invoice.campaign_subject}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {invoice.contact_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {invoice.campaign_mail}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {invoice.contact_mobile}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default ReportVisitedView;
