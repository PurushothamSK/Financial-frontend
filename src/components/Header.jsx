import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import AccountPopover from "./AccountPopover";
import logo from "../assets/images/Logo.png"; // ✅ Bundled import

export default function Header() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  const handleRedirect = () => {
    navigate(location.pathname === "/" ? "/register" : "/");
  };

  return (
    <AppBar
      sx={{
        boxShadow: "none",
        zIndex: theme.zIndex.appBar + 1,
        ml: 0,
        backgroundColor: '#e3f2fd',
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
      }}
    >
      <Toolbar sx={{ height: 1 }}>
        <Typography
          sx={{
            color: 'black',
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 1,
            fontWeight: 'bold',
          }}
          variant="h5"
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: 32, width: 32, objectFit: 'contain' }}
          />
          Financial Planning Calculator
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={2}>
          {isLoggedIn ? (
            <AccountPopover />
          ) : (
            <Typography
              variant="subtitle2"
              onClick={handleRedirect}
              sx={{
                color: theme.palette.text.primary,
                letterSpacing: 0.5,
                cursor: "pointer",
              }}
            >
              {location.pathname === "/" ? "Register" : "Login"}
            </Typography>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
