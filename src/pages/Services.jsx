import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, CardActions, Grid, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { getServices, createService, updateService, deleteService } from "../services/api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });

  const fetchServices = () => getServices().then((r) => setServices(r.data.data));
  useEffect(() => { fetchServices(); }, []);

  const handleOpen = (s = null) => {
    setEditId(s?._id || null);
    setForm({ title: s?.title || "", description: s?.description || "", image: null });
    setMsg({ text: "", type: "success" });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (form.image) fd.append("image", form.image);
      if (editId) { await updateService(editId, fd); setMsg({ text: "Service updated!", type: "success" }); }
      else { await createService(fd); setMsg({ text: "Service created!", type: "success" }); }
      fetchServices();
      setTimeout(() => setOpen(false), 800);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    await deleteService(id);
    fetchServices();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 2, borderBottom: "1px solid #e0e0e0", width: "100%" }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#1a1a2e">Services</Typography>
          <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>Manage all offered services</Typography>
        </Box>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Service</Button>
      </Box>

      <Grid container spacing={3}>
        {services.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              {s.image && <CardMedia component="img" height="160" image={s.image} alt={s.title} sx={{ objectFit: "cover" }} />}
              <CardContent sx={{ pb: 0 }}>
                <Typography fontWeight={700}>{s.title}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>{s.description}</Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleOpen(s)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(s._id)}><DeleteIcon /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Service" : "Add Service"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required margin="normal" />
            <TextField fullWidth label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required margin="normal" multiline rows={3} />
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
