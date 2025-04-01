import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { TextField, Button, Typography, Box, Container} from "@mui/material";

export default function Verifypasswordpassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    alert("Password set successfully!");
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            mb:10,
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Set Your Password
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, py: 1, 
                backgroundColor: "#00796B",
                "&:hover": { backgroundColor: "#005a4f" },
              }}
            >
              Set Password
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  );
}
