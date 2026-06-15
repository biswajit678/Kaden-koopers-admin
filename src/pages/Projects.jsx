import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, CardActions, Grid, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Stack, Alert, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { getProjects, createProject, updateProject, deleteProject, addImagesToProject, removeImageFromProject } from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [imgDialog, setImgDialog] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", feature: "" });
  const [editId, setEditId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });

  const fetchProjects = () => getProjects().then((r) => setProjects(r.data.data));
  useEffect(() => { fetchProjects(); }, []);

  const handleOpen = (p = null) => {
    setEditId(p?._id || null);
    setForm({ title: p?.title || "", description: p?.description || "", feature: (p?.feature || []).join(", ") });
    setMsg({ text: "", type: "success" });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { title: form.title, description: form.description, feature: form.feature.split(",").map((f) => f.trim()).filter(Boolean) };
      if (editId) { await updateProject(editId, payload); setMsg({ text: "Project updated!", type: "success" }); }
      else { await createProject(payload); setMsg({ text: "Project created!", type: "success" }); }
      fetchProjects();
      setTimeout(() => setOpen(false), 800);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddImages = async () => {
    if (!imageFiles.length) return;
    const fd = new FormData();
    Array.from(imageFiles).forEach((f) => fd.append("images", f));
    await addImagesToProject(imgDialog, fd);
    setImageFiles([]);
    setImgDialog(null);
    fetchProjects();
  };

  const handleRemoveImage = async (projectId, imageUrl) => {
    if (!confirm("Remove this image?")) return;
    await removeImageFromProject({ projectId, imageId: imageUrl });
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    fetchProjects();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 2, borderBottom: "1px solid #e0e0e0", width: "100%" }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#1a1a2e">Projects</Typography>
          <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>Manage all portfolio projects</Typography>
        </Box>
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Project</Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((p) => (
          <Grid item xs={12} md={6} key={p._id}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>{p.title}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>{p.description}</Typography>
                {p.feature?.length > 0 && (
                  <Stack direction="row" flexWrap="wrap" gap={0.5} mt={1}>
                    {p.feature.map((f, i) => <Chip key={i} label={f} size="small" color="primary" variant="outlined" />)}
                  </Stack>
                )}
                {p.images?.length > 0 && (
                  <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                    {p.images.map((img, i) => (
                      <Box key={i} position="relative">
                        <img src={img} alt="" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6 }} />
                        <IconButton size="small" onClick={() => handleRemoveImage(p._id, img)} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "error.main", color: "#fff", width: 20, height: 20, "&:hover": { bgcolor: "error.dark" } }}>
                          <DeleteIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
              <Divider />
              <CardActions>
                <IconButton color="primary" onClick={() => handleOpen(p)}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(p._id)}><DeleteIcon /></IconButton>
                <Button size="small" startIcon={<AddPhotoAlternateIcon />} onClick={() => setImgDialog(p._id)}>Add Images</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Project" : "Add Project"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required margin="normal" />
            <TextField fullWidth label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required margin="normal" multiline rows={3} />
            <TextField fullWidth label="Features (comma separated)" value={form.feature} onChange={(e) => setForm({ ...form, feature: e.target.value })} margin="normal" />
            {msg.text && <Alert severity={msg.type} sx={{ mt: 1 }}>{msg.text}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? "Saving..." : editId ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Images Dialog */}
      <Dialog open={!!imgDialog} onClose={() => setImgDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Images</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
            Select Images (max 10)
            <input type="file" hidden multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)} />
          </Button>
          {imageFiles.length > 0 && <Typography variant="caption" display="block" mt={1}>{imageFiles.length} file(s) selected</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImgDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddImages} disabled={!imageFiles.length}>Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
