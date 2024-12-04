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
import { IconArrowBarLeft, IconTrash } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";

const CampaginIndivialView = () => {
  const [campagindata, setCampaginData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchCampaginData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/panel-fetch-campaign-by-id/${id}`,
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
  }, [id]);

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
        accessorKey: "campaign_date",
        header: "Date",
        size: 150,
        Cell: ({ value }) => moment(value).format("DD-MM-YYYY"),
      },

      {
        accessorKey: "campaign_time",
        header: "Time",
        size: 100,
      },
      {
        accessorKey: "template_name",
        header: "Template Name",
        size: 150,
      },
      {
        accessorKey: "campaign_individual",
        header: "Group/Individual",
        size: 50,
      },
      {
        accessorKey: "campaign_status",
        header: "Status",
        size: 50,
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
      const handleActivate = () => {
        const selectedRows = table.getSelectedRowModel().flatRows;
        selectedRows.forEach((row) => {
          alert(`Activating: ${row.getValue("indicomp_full_name")}`);
        });
      };

      return (
        <Flex p="md" justify="space-between">
          <Text size="xl" weight={700}>
            <Flex justify="center" align="center" sx={{ gap: "8px" }}>
              <IconArrowBarLeft
                className="cursor-pointer"
                onClick={() => {
                  navigate("/campaigns");
                }}
              />
              Campaign List
            </Flex>
          </Text>

          <Flex gap="sm">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />
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

export default CampaginIndivialView;
