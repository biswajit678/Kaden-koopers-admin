import { NavLink, useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Button, Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LogoutIcon from "@mui/icons-material/Logout";

const links = [
  { to: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/banners", label: "Banners", icon: <ImageIcon /> },
  { to: "/projects", label: "Projects", icon: <FolderIcon /> },
  { to: "/gallery", label: "Gallery", icon: <PhotoLibraryIcon /> },
  { to: "/services", label: "Services", icon: <MiscellaneousServicesIcon /> },
  { to: "/contacts", label: "Contacts", icon: <ContactMailIcon /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };

  return (
    <Box sx={{ width: 240, minHeight: "100vh", bgcolor: "#1e1e2d", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0 }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: "#ffffff !important" }}>Kaden Kopper</Typography>
        <Typography variant="caption" sx={{ color: "#aaaaaa !important" }}>Admin Panel</Typography>
      </Box>
      <Divider sx={{ borderColor: "#2d2d3f" }} />
      <List sx={{ flex: 1, pt: 1 }}>
        {links.map((link) => (
          <ListItem key={link.to} disablePadding>
            <NavLink to={link.to} end={link.to === "/"} style={{ textDecoration: "none", width: "100%" }}>
              {({ isActive }) => (
                <ListItemButton sx={{ mx: 1, borderRadius: 2, mb: 0.5, bgcolor: isActive ? "#3699ff1a" : "transparent", borderLeft: isActive ? "3px solid #3699ff" : "3px solid transparent", "&:hover": { bgcolor: "#3699ff1a" } }}>
                  <ListItemIcon sx={{ color: isActive ? "#3699ff" : "#aaa", minWidth: 36 }}>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} sx={{ "& .MuiListItemText-primary": { color: isActive ? "#fff" : "#aaa", fontSize: "0.9rem" } }} />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: "#2d2d3f" }} />
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={logout} size="small">Logout</Button>
      </Box>
    </Box>
  );
}
