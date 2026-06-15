import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, CardActions, Grid, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { getGalleries, createGallery, updateGallery, deleteGallery } from "../services/api";

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", image: null });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });

  const fetchGalleries = () => getGalleries().then((r) => setGalleries(r.data.data));
  useEffect(() => { fetchGalleries(); }, []);

  const handleOpen = (g = null) => {
    setEditId(g?._id || null);
    setForm({ title: g?.title || "", image: null });
    setMsg({ text: "", type: "success" });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.image) fd.append("image", form.image);
      if (editId) { await updateGallery(editId, fd); setMsg({ text: "Gallery updated!", type: "success" }); }
      else { await createGallery(fd); setMsg({ text: "Gallery created!", type: "success" }); }
      fetchGalleries();
      setTimeout(() => setOpen(false), 800);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this gallery item?")) return;
    await deleteGallery(id);
    fetchGalleries();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 2, borderBottom: "1px solid #e0e0e0", width: "100%" }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#1a1a2e">Gallery</Typography>
          <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>Manage all gallery items</Typography>
        </Box>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Item</Button>
      </Box>

      <Grid container spacing={3}>
        {galleries.map((g) => (
          <Grid item xs={12} sm={6} md={4} key={g._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              {(g.image?.length > 0) && <CardMedia component="img" height="160" image={Array.isArray(g.image) ? g.image[0] : g.image} alt={g.title} sx={{ objectFit: "cover" }} />}
              <CardContent sx={{ pb: 0 }}>
                <Typography fontWeight={600}>{g.title}</Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleOpen(g)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(g._id)}><DeleteIcon /></IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
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
