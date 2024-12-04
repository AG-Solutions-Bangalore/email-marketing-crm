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

const ReportCampagin = () => {
  const [reportcampagindata, SetReportCampaginData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportCampaginData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-donors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      SetReportCampaginData(response.data?.individualCompanies || []);
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportCampaginData();
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
        accessorKey: "indicomp_full_name",
        header: "Date",
        size: 150,
      },
      {
        accessorKey: "indicomp_full_name",
        header: "Time",
        size: 150,
      },
      {
        accessorKey: "indicomp_full_name",
        header: "Template Name",
        size: 150,
      },
      {
        accessorKey: "indicomp_full_name",
        header: "Subject",
        size: 150,
      },
      {
        accessorKey: "indicomp_full_name",
        header: "Email",
        size: 150,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: reportcampagindata,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showGlobalFilter: true },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    renderTopToolbar: ({ table }) => {
      const handleActivate = () => {
        const selectedRows = table.getSelectedRowModel().flatRows;
        selectedRows.forEach((row) => {
          alert(`Activating: ${row.getValue("indicomp_full_name")}`);
        });
      };

      return (
        <Flex
          p="md"
          justify="space-between"
          sx={{
            overflowX: "auto",
            maxWidth: "100%", // Prevents horizontal overflow of the container
          }}
          flexWrap="wrap"
        >
          <Text size="xl" weight={700}>
            Campaign Sent
          </Text>
          <Flex gap="sm">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <Button
              onClick={handleActivate}
              sx={{
                backgroundColor: "green !important",
                color: "white",
                "&:hover": {
                  backgroundColor: "red  !important",
                },
              }}
            >
              Export
            </Button>
            {/* <Button className="w-36 text-white bg-blue-600 !important hover:bg-violet-400 hover:animate-pulse">
              Add
            </Button> */}
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

export default ReportCampagin;
