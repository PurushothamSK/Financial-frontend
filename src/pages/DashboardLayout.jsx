import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "../components/Header";
import {
  InfoOutlined,
  AttachMoney,
  ReceiptLong,
  SavingsOutlined,
  ElderlyOutlined,
  TableRowsOutlined,
  DashboardOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navItems = [
  {
    label: "Basic Info",
    path: "/basicinfo",
    icon: <InfoOutlined fontSize="medium" />,
    role: "USER",
  },
  {
    label: "Income",
    path: "/incomeinfo",
    icon: <AttachMoney fontSize="medium" />,
    role: "USER",
  },
  {
    label: "Expenses",
    path: "/expenseinfo",
    icon: <ReceiptLong fontSize="medium" />,
    role: "USER",
  },
  {
    label: "Investment",
    path: "/investment",
    icon: <SavingsOutlined fontSize="medium" />,
    role: "USER",
  },
  {
    label: "Retirement",
    path: "/retirement-savings",
    icon: <ElderlyOutlined fontSize="medium" />,
    role: "USER",
  },
  {
    label: "Simulation",
    path: "/table",
    icon: <TableRowsOutlined fontSize="medium" />,
    role: "USER",
  },
  {
    label: "Admin Dashboard",
    path: "/admindashboard",
    icon: <DashboardOutlined fontSize="medium" />,
    role: "ADMIN",
  },
  {
  label: 'All Users',
  path: '/admin-users',
  icon: <PeopleAltOutlined fontSize="medium" />,
  role: 'ADMIN',
}
];

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const filteredNavItems = navItems.filter((item) => item.role === role);

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 100,
            bgcolor: '#e3f2fd',
            p: 1,
            borderRight: "1px solid #ddd",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            pt: 9,
            height: "100vh",
          }}
        >
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Box
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 1,
                  px: 1,
                  borderRadius: 2,
                  width: "100%",
                  backgroundColor: isActive ? "#5BE49B" : "transparent", // Active
                  color: isActive ? "#fff" : "inherit",
                  "&:hover": {
                    backgroundColor: "#C8FAD6", // Hover
                  },
                }}
              >
                {item.icon}
                <Typography
                  variant="caption"
                  sx={{ mt: 0.5, textAlign: "center" }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1,  }}>{children}</Box>
      </Box>
    </>
  );
};

export default DashboardLayout;
