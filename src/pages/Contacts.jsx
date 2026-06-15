import { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip } from "@mui/material";
import { getContacts } from "../services/api";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContacts().then((r) => setContacts(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, pb: 2, borderBottom: "1px solid #e0e0e0", width: "100%" }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="#1a1a2e">Contact Submissions</Typography>
          <Typography variant="body2" sx={{ color: "#888", mt: 0.5 }}>All messages from website visitors</Typography>
        </Box>
        <Chip label={`${contacts.length} total`} color="primary" size="medium" />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#1e1e2d" }}>
              <TableRow>
                {["Name", "Email", "Phone", "Message", "Date"].map((h) => (
                  <TableCell key={h} sx={{ color: "#fff", fontWeight: 700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">No submissions yet.</TableCell></TableRow>
              ) : (
                contacts.map((c) => (
                  <TableRow key={c._id} hover>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>{c.message}</TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
