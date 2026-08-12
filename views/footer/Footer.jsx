"use client";

import React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { 
  Pill, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Send,
  ChevronRight
} from "lucide-react";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#020617",
        color: "#ffffff",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        pt: { xs: 8, md: 10 },
        pb: 4,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background ambient lighting */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), rgba(16, 185, 129, 0.5), transparent)",
        }}
      />

      <Container maxWidth="lg">
        {/* Value Proposition Highlights Bar */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {[
            { icon: <ShieldCheck size={28} className="text-blue-400" />, title: "100% Genuine Medicines", desc: "Sourced directly from licensed suppliers" },
            { icon: <Truck size={28} className="text-emerald-400" />, title: "Express Home Delivery", desc: "Superfast dispatch straight to your door" },
            { icon: <Clock size={28} className="text-cyan-400" />, title: "24/7 Health Assistance", desc: "Round-the-clock customer support" },
            { icon: <Heart size={28} className="text-rose-400" />, title: "Care & Quality Guaranteed", desc: "Strict temperature-controlled safety" },
          ].map((item, idx) => (
            <Grid key={idx} xs={12} sm={6} md={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 2.5,
                  borderRadius: "16px",
                  backgroundColor: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(30, 41, 59, 0.6)",
                    borderColor: "rgba(59, 130, 246, 0.3)",
                    transform: "translateY(-3px)",
                  }
                }}
              >
                <Box sx={{ p: 1, borderRadius: "12px", backgroundColor: "rgba(255, 255, 255, 0.04)" }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.55)", fontSize: "0.8rem", display: "block", mt: 0.5 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Main Footer Links & Information */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Brand Info Column */}
          <Grid xs={12} md={4}>
            <Box sx={{ pr: { md: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #10b981)", color: "#ffffff" }}>
                  <Pill size={22} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "0.05em", color: "#ffffff" }}>
                  HEALTHCARE EXPERT
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.7, mb: 3, fontSize: "0.9rem" }}>
                Your trusted digital pharmacy platform bringing authentic prescription medicines, daily wellness essentials, and specialist consultations right to your doorstep.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, color: "rgba(255, 255, 255, 0.7)", fontSize: "0.85rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <MapPin size={16} style={{ color: "#3b82f6" }} />
                  <span>Lucknow, Uttar Pradesh, India</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Phone size={16} style={{ color: "#10b981" }} />
                  <span>+91 98765 43210</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Mail size={16} style={{ color: "#38bdf8" }} />
                  <span>support@healthcareexpert.com</span>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid xs={12} sm={6} md={2.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: "#ffffff", letterSpacing: "0.02em" }}>
              Quick Navigation
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { label: "Home Page", href: "/" },
                { label: "Medicine Shop", href: "/dashboard/medicine" },
                { label: "Medical Categories", href: "/dashboard/medical-categories" },
                { label: "Our Services", href: "/dashboard/services" },
                { label: "My Cart", href: "/dashboard/cart" },
                { label: "My Orders History", href: "/dashboard/orders" },
              ].map((link, idx) => (
                <Box component="li" key={idx}>
                  <Link href={link.href} style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.9rem", transition: "color 0.2s ease" }} className="hover:text-blue-400 flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-blue-500/60" />
                    <span>{link.label}</span>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Healthcare Segments */}
          <Grid xs={12} sm={6} md={2.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: "#ffffff", letterSpacing: "0.02em" }}>
              Popular Categories
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                "Prescription Drugs",
                "Antibiotics & Relief",
                "Cardiac & Blood Pressure",
                "Vitamins & Supplements",
                "Personal Care & Hygiene",
                "First Aid & Diagnostic Kits",
              ].map((cat, idx) => (
                <Box component="li" key={idx}>
                  <Link href="/dashboard/medicine" style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "0.9rem", transition: "color 0.2s ease" }} className="hover:text-emerald-400 flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-emerald-500/60" />
                    <span>{cat}</span>
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Newsletter Column */}
          <Grid xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: "#ffffff", letterSpacing: "0.02em" }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 2, fontSize: "0.85rem", lineHeight: 1.6 }}>
              Subscribe to get exclusive health tips, refill reminders, and special discount offers directly to your inbox.
            </Typography>
            
            <Box component="form" onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                placeholder="Enter your email"
                variant="outlined"
                size="small"
                fullWidth
                slotProps={{
                  htmlInput: {
                    style: { color: "#ffffff", fontSize: "0.875rem" }
                  }
                }}
                sx={{
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.12)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(59, 130, 246, 0.4)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                endIcon={<Send size={16} />}
                sx={{
                  borderRadius: "12px",
                  py: 1,
                  background: "linear-gradient(to right, #3b82f6, #10b981)",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(to right, #2563eb, #059669)",
                  }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 4 }} />

        {/* Bottom Bar / Copyright */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "0.85rem"
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "inherit" }}>
            © {new Date().getFullYear()} Healthcare Expert. All rights reserved. Built with precision and care.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Return & Refund</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
