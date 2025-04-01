import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { TextField, Button, Typography, Box, Container } from "@mui/material";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Password reset link has been sent to your email.");
    
    // Simulate API Call (Replace with actual API request)
    setTimeout(() => {
      alert("Reset link sent to " + email);
    }, 1000);
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            mb: 10,
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>  
            Forgot Password?
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Enter your email, and we'll send you a link to reset your password.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Enter Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" variant="body2" mt={1}>
                {success}
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
              Send Reset Link
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  );
}
