import React from "react";
import { AppBar, Toolbar, IconButton, Button, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "white", boxShadow: "none" }}>
      <Toolbar>
        {/* Left side: Menu Icon & "HDFC" Link */}
        <IconButton edge="start" color="primary" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "#003366", // Dark blue for contrast
            fontWeight: "bold",
            ml: 1,
          }}
        >
          SkyNet 
        </Typography>

        {/* Right Side: Navigation Links & Sign Out */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "15px" }}>
          <Button onClick={() => navigate("/loan-eligibility")} sx={navLinkStyle}>
            Loan Eligibility
          </Button>
          <Button onClick={() => navigate("/ai-branch-manager")} sx={navLinkStyle}>
            AI Branch Manager
          </Button>
          <Button onClick={() => navigate("/open-account")} sx={navLinkStyle}>
            Open Account
          </Button>
          <Button onClick={() => navigate("/customer-interaction")} sx={navLinkStyle}>
            Customer Interaction
          </Button>

          {/* CTA Sign Out Button */}
          <Button
            variant="contained"
            color="error"
            sx={{
              backgroundColor: "#003366", // Dark Blue
              color: "white",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#002855" }, // Slightly darker blue on hover
            }}
          >
            Sign Out
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

// Common Nav Link Styling
const navLinkStyle = {
  textTransform: "none",
  color: "#003366",
  fontWeight: "500",
  "&:hover": { color: "#002855" },
};

export default Navbar;
