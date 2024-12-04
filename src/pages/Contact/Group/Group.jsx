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
import { IconEdit, IconEye } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const Group = () => {
  const [groupdata, setGroupData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fetchGroupData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/panel-fetch-group-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroupData(response.data?.group || []);
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupData();
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
        accessorKey: "group_name",
        header: "Group Name",
        size: 150,
      },
      {
        accessorKey: "commentcount",
        header: "No of Members",
        size: 150,
      },
      {
        accessorKey: "group_status",
        header: "Status",
        size: 50,
      },
      {
        id: "id",
        header: "Action",
        size: 50,
        enableHiding: false,
        Cell: ({ row }) => (
          <Flex gap="xs">
            <IconEdit
              className="cursor-pointer text-blue-600 hover:text-blue-800"
              title="Edit"
              onClick={() => {
                navigate(`/group/edit/${row.original.id}`);
              }}
            />
            {/* <IconTrash
              className="cursor-pointer text-blue-600 hover:text-red-800"
              title="Delete"
            /> */}
          </Flex>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: groupdata,
    enableColumnActions: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showGlobalFilter: true },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    renderTopToolbar: ({ table }) => {
      //   const handleActivate = () => {
      //     const selectedRows = table.getSelectedRowModel().flatRows;
      //     selectedRows.forEach((row) => {
      //       alert(`Activating: ${row.getValue("indicomp_full_name")}`);
      //     });
      //   };

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
            Group List
          </Text>
          <Flex gap="sm">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />
            {/* <Button
              onClick={handleActivate}
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
            </Button> */}
            <Button
              className="w-36 text-white bg-blue-600 !important hover:bg-violet-400 hover:animate-pulse"
              onClick={() => {
                navigate("/group/add");
              }}
            >
              Add
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

export default Group;
