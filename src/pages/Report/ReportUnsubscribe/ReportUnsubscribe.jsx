import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import { Box, Button, Center, Flex, Loader, Text } from "@mantine/core";
import { IconEdit, IconEye, IconReceipt } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";

const ReportUnsubscribe = () => {
  const [reportunsubscribedata, SetReportUnsubscribeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportUnsubscribeData = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post(
        `${BASE_URL}/panel-fetch-unsubscribe-report`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status == 200) {
        SetReportUnsubscribeData(response.data.unsubscribe);
      } else {
        console.error("Failed to fetch data", response);
      }
    } catch (error) {
      console.error("Error fetching unsubscribe report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportUnsubscribeData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "index",
        header: "#",
        size: 50,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "contact_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "contact_email",
        header: "Email",
        size: 150,
      },
      {
        accessorKey: "contact_mobile",
        header: "Mobile",
        size: 150,
      },
    ],
    []
  );
  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios({
        url: `${BASE_URL}/panel-download-unsubscribe-report`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Unsubscribe_list.csv");
      document.body.appendChild(link);
      link.click();

      toast.success("Unsubscribe list exported successfully!");
    } catch (error) {
      toast.error("Failed to export Unsubscribe list.");
      console.error("Export error:", error);
    }
  };
  const table = useMantineReactTable({
    columns,
    data: reportunsubscribedata,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showGlobalFilter: true },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    renderTopToolbar: ({ table }) => {
      return (
        <Flex
          p="md"
          justify="space-between"
          sx={{
            overflowX: "auto",
            maxWidth: "100%",
          }}
          flexWrap="wrap"
        >
          {" "}
          <Text size="xl" weight={700}>
            Unsubscribe
          </Text>
          <Flex gap="sm">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <Button
              onClick={handleExport}
              sx={{
                backgroundColor: "green !important",
                color: "white",
                "&:hover": {
                  backgroundColor: "red  !important",
                },
              }}
            >
              Download
            </Button>
          </Flex>
        </Flex>
      );
    },
  });

  return (
    <Layout>
      <Box className="max-w-screen">
        {isLoading ? (
          <Center style={{ height: "70vh", flexDirection: "column" }}>
            <Loader size="lg" variant="dots" color="blue" />
            <Text mt="md" color="gray" size="lg">
              Loading, please wait...
            </Text>
          </Center>
        ) : (
          <MantineReactTable table={table} />
        )}
      </Box>
    </Layout>
  );
};

export default ReportUnsubscribe;
