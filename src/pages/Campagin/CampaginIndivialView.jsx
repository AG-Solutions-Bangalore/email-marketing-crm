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
import { DialogBody, DialogFooter, Dialog } from "@material-tailwind/react";
import toast from "react-hot-toast";

const CampaginIndivialView = () => {
  const [campagindata, setCampaginData] = useState([]);
  const [campagindatastatus, setCampaginDataStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
      setCampaginDataStatus(response.data?.campaignsStatus);
    } catch (error) {
      console.error("Error fetching template data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaginData();
  }, [id]);
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);
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
        accessorKey: "campaign_list_name",
        header: "Campagin List Name",
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
      {
        id: "id",
        header: "Action",
        size: 50,
        enableHiding: false,
        Cell: ({ row }) => (
          <Flex gap="xs">
            <IconTrash
              className="cursor-pointer text-blue-600 hover:text-red-800"
              title="Delete"
              onClick={() => onDelete(row.original.id)}
            />
          </Flex>
        ),
      },
    ],
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${BASE_URL}/panel-update-campaign-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      handleClose();
      navigate("/campaigns");
      toast.success("Campaign Closed successfully!");
    } catch (error) {
      toast.error("Error closing campaign!");
      console.error(error);
    }
  };

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
            {campagindatastatus.campaign_list_status === "Pending" && (
              <Button
                className="w-36 text-white bg-red-600 !important hover:bg-red-400 hover:animate-pulse"
                onClick={handleOpen}
              >
                Close
              </Button>
            )}
          </Flex>
        </Flex>
      );
    },
  });
  const onDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete-campaign/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Campaign Deleted successfully!");
      navigate("/campaigns");
    } catch (error) {
      toast.error("Error deleting campaign!");
      console.error(error);
    }
  };

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

      <Dialog open={open} handler={handleOpen}>
        <DialogBody>
          <div className="text-xl font-bold text-black">
            Are you sure you want to Close the Campagin?
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            className="w-36 text-white bg-red-600 !important hover:bg-red-400 hover:animate-pulse mr-3"
            onClick={handleClose}
          >
            No{" "}
          </Button>
          <Button
            className="w-36 text-white bg-blue-600 !important hover:bg-violet-400 hover:animate-pulse"
            onClick={onSubmit}
          >
            Yes{" "}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default CampaginIndivialView;
