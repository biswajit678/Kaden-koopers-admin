import { Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

export default function Layout() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ ml: "240px", p: 4, flex: 1, minHeight: "100vh", bgcolor: "#f5f5f5", width: "calc(100% - 240px)" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
