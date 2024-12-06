import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import { Box, Button, Center, Flex, Loader, Text } from "@mantine/core";
import { IconEdit, IconEye, IconReceipt } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";

const Campagin = () => {
  const [campagindata, setCampaginData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const naviagte = useNavigate();
  const fetchCampaginData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/panel-fetch-campaign-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCampaginData(response.data?.campaign || []);
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaginData();
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
        accessorKey: "campaign_list_date",
        header: "Date",
        size: 150,
        Cell: ({ value }) => moment(value).format("DD-MM-YYYY"),
      },

      {
        accessorKey: "template_name",
        header: "Template Name",
        size: 150,
      },
      {
        accessorKey: "group_names",
        header: "Group/Individual",
        size: 50,
      },
      {
        accessorKey: "total_campaigns",
        header: "Total/Pending",
        size: 150,
        Cell: ({ row }) => {
          const totalCampaigns = row.original.total_campaigns ;
          const pendingCampaigns = row.original.pending_campaigns ;
          return (
            <span>{`${totalCampaigns} / ${pendingCampaigns}`}</span>
          );
        },
      },

      {
        accessorKey: "campaign_list_status",
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
            <IconEye
              className="cursor-pointer text-blue-600 hover:text-red-800"
              title="View"
              onClick={() => {
                naviagte(`/campaigns/view/${row.original.id}`);
              }}
            />
          </Flex>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: campagindata,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableColumnActions: false,
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
            Campaign List
          </Text>
          <Flex gap="sm">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />

            <Button
              className="w-36 text-white bg-blue-600 !important hover:bg-violet-400 hover:animate-pulse"
              onClick={() => {
                naviagte("/campaigns/add");
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

export default Campagin;
