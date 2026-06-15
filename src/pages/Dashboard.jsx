import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Button, Divider, Avatar } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getBanners, getProjects, getGalleries, getServices, getContacts } from "../services/api";

const sections = [
  { label: "Banners", key: "banners", icon: <ImageIcon fontSize="large" />, color: "#3699ff", bg: "#3699ff1a", path: "/banners", desc: "Manage hero banners shown on the website" },
  { label: "Projects", key: "projects", icon: <FolderIcon fontSize="large" />, color: "#0bb783", bg: "#0bb7831a", path: "/projects", desc: "Add, edit and manage portfolio projects" },
  { label: "Gallery", key: "gallery", icon: <PhotoLibraryIcon fontSize="large" />, color: "#8950fc", bg: "#8950fc1a", path: "/gallery", desc: "Upload and organize photo gallery items" },
  { label: "Services", key: "services", icon: <MiscellaneousServicesIcon fontSize="large" />, color: "#f64e60", bg: "#f64e601a", path: "/services", desc: "Manage services offered by Kaden Kopper" },
  { label: "Contacts", key: "contacts", icon: <ContactMailIcon fontSize="large" />, color: "#ffa800", bg: "#ffa8001a", path: "/contacts", desc: "View all contact form submissions" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ banners: 0, projects: 0, gallery: 0, services: 0, contacts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBanners(), getProjects(), getGalleries(), getServices(), getContacts()])
      .then(([b, p, g, s, c]) => setCounts({
        banners: b.data.data.length,
        projects: p.data.data.length,
        gallery: g.data.data.length,
        services: s.data.data.length,
        contacts: c.data.data.length,
      }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ background: "linear-gradient(135deg, #1e1e2d 0%, #0f3460 100%)", borderRadius: 3, p: 3, mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#ffffff !important" }}>Welcome back, Admin!</Typography>
          <Typography variant="body2" sx={{ color: "#cccccc !important" }} mt={0.5}>Here's what's happening with Kaden Kopper today.</Typography>
        </Box>
        <Avatar sx={{ bgcolor: "#3699ff", width: 52, height: 52, fontSize: "1.4rem", color: "#fff" }}>K</Avatar>
      </Box>

      {/* Stats Row */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
      ) : (
        <>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e !important" }} mb={2}>Overview</Typography>
          <Grid container spacing={2} mb={4}>
            {sections.map((s) => (
              <Grid item xs={12/5} key={s.key} sx={{ flexGrow: 1 }}>
                <Card
                  onClick={() => navigate(s.path)}
                  sx={{
                    borderRadius: 3, boxShadow: 2, cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": { boxShadow: 6, transform: "translateY(-3px)" },
                    borderTop: `4px solid ${s.color}`,
                    aspectRatio: "1 / 1",
                    display: "flex", flexDirection: "column", justifyContent: "center",
                  }}
                >
                  <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                    <Box sx={{ bgcolor: s.bg, p: 1.2, borderRadius: 2, color: s.color, display: "inline-flex" }}>{s.icon}</Box>
                    <Typography variant="h3" fontWeight={800} color={s.color} lineHeight={1}>{counts[s.key]}</Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ color: "#222" }}>{s.label}</Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>Click to manage</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 4 }} />

          {/* Quick Actions */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e !important" }} mb={2}>Quick Actions</Typography>
          <Grid container spacing={3}>
            {sections.map((s) => (
              <Grid item xs={12} sm={6} md={4} key={s.key}>
                <Card sx={{ borderRadius: 3, boxShadow: 1, "&:hover": { boxShadow: 4 }, transition: "box-shadow 0.2s" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                      <Box sx={{ bgcolor: s.bg, p: 1.2, borderRadius: 2, color: s.color }}>{s.icon}</Box>
                      <Box>
                        <Typography fontWeight={700} color="#1a1a2e">{s.label}</Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>{counts[s.key]} items</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#555" }} mb={2}>{s.desc}</Typography>
                    <Button variant="outlined" size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate(s.path)}
                      sx={{ borderColor: s.color, color: s.color, "&:hover": { bgcolor: s.bg, borderColor: s.color } }}>
                      Manage {s.label}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
