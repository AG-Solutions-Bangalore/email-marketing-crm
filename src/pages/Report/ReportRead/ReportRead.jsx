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

const ReportRead = () => {
  const [reportreadData, setReportReadData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportReadData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/fetch-donors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReportReadData(response.data?.individualCompanies || []);
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportReadData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "index", // We'll use a custom accessorKey for the index column
        header: "#", // Header name for the index column
        size: 50, // Adjust the size of the column
        Cell: ({ row }) => row.index + 1, // Add the index value starting from 1
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
        accessorKey: "indicomp_type",
        header: "Subject",
        size: 50,
      },
      {
        accessorKey: "indicomp_mobile_phone",
        header: "Email",
        size: 50,
      },
      //   {
      //     id: "action",
      //     header: "Action",
      //     size: 50,
      //     enableHiding: false,
      //     Cell: ({ row }) => (
      //       <Flex gap="xs">
      //         <IconEye
      //           className="cursor-pointer text-blue-600 hover:text-blue-800"
      //           title="Edit"
      //         />
      //         <IconTrash
      //           className="cursor-pointer text-blue-600 hover:text-red-800"
      //           title="View"
      //         />
      //       </Flex>
      //     ),
      //   },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: reportreadData,
    enableColumnFilterModes: true,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true, showGlobalFilter: true },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    renderTopToolbar: ({ table }) => {
      const handleActivate = () => {
        const selectedRows = table.getSelectedRowModel().flatRows;
        selectedRows.forEach((row) => {
          alert(`Activating: ${row.getValue("indicomp_full_name")}`);
        });
      };

      return (
        <Flex p="md" justify="space-between">
          <Text size="xl" weight={700}>
            Read
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

export default ReportRead;
