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
import { IconEdit } from "@tabler/icons-react";
// import { toast } from "react-hot-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [contactData, setContactData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchContactData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/panel-fetch-contact-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContactData(response.data?.contact || []);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios({
        url: `${BASE_URL}/panel-export-contact`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensure file download format
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contact_list.csv");
      document.body.appendChild(link);
      link.click();

      toast.success("Contact list exported successfully!");
    } catch (error) {
      toast.error("Failed to export contact list.");
      console.error("Export error:", error);
    }
  };

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
        accessorKey: "group_names",
        header: "Group Name",
        size: 150,
      },
      {
        accessorKey: "contact_name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "contact_email",
        header: "Email",
        size: 50,
      },
      {
        accessorKey: "contact_mobile",
        header: "Mobile",
        size: 50,
      },
      {
        accessorKey: "contact_status",
        header: "Status",
        size: 50,
      },
      {
        id: "actions",
        header: "Action",
        size: 50,
        enableHiding: false,
        Cell: ({ row }) => (
          <Flex gap="xs">
            <IconEdit
              className="cursor-pointer text-blue-600 hover:text-blue-800"
              title="Edit"
              onClick={() => navigate(`/Contact/edit/${row.original.id}`)}
            />
          </Flex>
        ),
      },
    ],
    [navigate]
  );

  const table = useMantineReactTable({
    columns,
    data: contactData,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showGlobalFilter: true },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    renderTopToolbar: ({ table }) => (
      <Flex
        p="md"
        justify="space-between"
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
        }}
        flexWrap="wrap"
      >
        <Text size="xl" weight={700}>
          Contact List
        </Text>
        <Flex gap="sm">
          <MRT_GlobalFilterTextInput table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <Button
            onClick={() => navigate("/Contact/import")}
            sx={{
              backgroundColor: "green !important",
              color: "white",
              "&:hover": {
                backgroundColor: "red  !important",
              },
            }}
          >
            Import
          </Button>
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
            Export
          </Button>
          <Button
            className="w-36 text-white bg-blue-600 !important hover:bg-violet-400 hover:animate-pulse"
            onClick={() => navigate("/Contact/add")}
          >
            Add
          </Button>
        </Flex>
      </Flex>
    ),
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

export default Contact;
