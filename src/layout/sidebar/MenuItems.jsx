import {
  IconCopy,
  IconLayoutDashboard,
  IconReport,
  IconDownload,
  IconPhone,
  IconTemplate,
  IconBook,
  IconBrandCampaignmonitor,
  IconUserMinus,
  IconUsersGroup,
  IconProgressCheck,
  IconUserUp,
  IconInfoHexagon,
} from "@tabler/icons-react";

const getMenuItems = (userTypeId) => [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: "dashboard",
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/home",
  },
  {
    id: "template",
    title: "Template",
    icon: IconTemplate,
    href: "/templates",
  },
  {
    id: "campaign",
    title: "Campaign",
    icon: IconBrandCampaignmonitor,
    href: "/campaigns",
  },

  {
    navlabel: true,
    subheader: "Contact",
  },

  {
    id: "contact",
    title: "Contact",
    icon: IconPhone,
    // href: "/table",
    subItems: [
      // for nested sum menu item
      {
        id: "sub-contact",
        title: "Contact",
        icon: IconPhone,
        href: "/Contact",
      },
      {
        id: "group",
        title: "Group",
        icon: IconUsersGroup,
        href: "/group",
      },
    ],
  },

  {
    navlabel: true,
    subheader: "Summary",
  },
  {
    id: "report",
    title: "Report",
    icon: IconReport,
    // href: "/",
    subItems: [
      // for nested sum menu item
      {
        id: "read",
        title: "Read",
        icon: IconBook,
        href: "/report/read",
      },
      {
        id: "unsubscribe",
        title: "Unsubscribe",
        icon: IconUserMinus,
        href: "/report/unsubscribe",
      },
      {
        id: "Visited",
        title: "Visted/checked",
        icon: IconProgressCheck,
        href: "/report/visted",
      },
      {
        id: "campaignSent",
        title: "Campaign Sent",
        icon: IconUserUp,
        href: "/report/campaign",
      },
    ],
  },

  {
    id: "about",
    title: "About Developer",
    icon: IconInfoHexagon,
    href: "/developer",
  },
];

export default getMenuItems;
