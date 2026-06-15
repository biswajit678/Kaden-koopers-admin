import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, CardActions, Grid, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../services/api";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", image: null });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });

  const fetchBanners = () => getBanners().then((r) => setBanners(r.data.data));
  useEffect(() => { fetchBanners(); }, []);

  const handleOpen = (banner = null) => {
    setEditId(banner?._id || null);
    setForm({ title: banner?.title || "", image: null });
    setMsg({ text: "", type: "success" });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "success" });
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.image) fd.append("image", form.image);
      if (editId) { await updateBanner(editId, fd); setMsg({ text: "Banner updated!", type: "success" }); }
      else { await createBanner(fd); setMsg({ text: "Banner created!", type: "success" }); }
      fetchBanners();
      setTimeout(() => setOpen(false), 800);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    await deleteBanner(id);
    fetchBanners();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 2, borderBottom: "1px solid #e0e0e0", width: "100%" }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#1a1a2e">Banners</Typography>
          <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>Manage all website banners</Typography>
        </Box>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Banner</Button>
      </Box>

      <Grid container spacing={3}>
        {banners.map((b) => (
          <Grid item xs={12} sm={6} md={3} key={b._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardMedia component="img" height="180" image={b.image} alt={b.title} sx={{ objectFit: "cover" }} />
              <CardContent sx={{ px: 2, pt: 2, pb: 0 }}>
                <Typography fontWeight={700} fontSize="1rem" color="#1a1a2e" mb={1}>{b.title}</Typography>
                <Chip label={b.isActive ? "Active" : "Inactive"} color={b.isActive ? "success" : "default"} size="small" />
              </CardContent>
              <Box sx={{ height: "1px", bgcolor: "#e0e0e0", mx: 2, mt: 2 }} />
              <CardActions sx={{ px: 2, py: 1.5, gap: 1 }}>
                <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpen(b)}>Edit</Button>
                <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(b._id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Banner" : "Add Banner"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required margin="normal" />
            <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
              Upload Image
              <input type="file" hidden accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
            </Button>
            {form.image && <Typography variant="caption" display="block" mt={1}>{form.image.name}</Typography>}
            {msg.text && <Alert severity={msg.type} sx={{ mt: 2 }}>{msg.text}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? "Saving..." : editId ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
