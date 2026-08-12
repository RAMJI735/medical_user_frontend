"use client";

import BannerCarousel from "../../views/homeBanner/BannerCarousel";
import CategoriesList from "../../views/categories/CategoriesList";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { Pill, ShieldCheck, Truck, Clock, ArrowRight, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", width: "100%", backgroundColor: "#020617", overflowX: "hidden" }}>
      {/* Hero Banner Carousel */}
      <BannerCarousel />

      {/* Featured Medical Categories */}
      <CategoriesList />

      {/* Express Healthcare Banner Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          px: 2,
          position: "relative",
          background: "linear-gradient(180deg, #020617 0%, rgba(15, 23, 42, 0.8) 50%, #020617 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            className="glass-panel"
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              borderRadius: "32px",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.1)",
            }}
          >
            <Box sx={{ maxWidth: "600px" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: "9999px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  color: "#34d399",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                <HeartPulse size={16} />
                <span>24/7 Digital Health Hub</span>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "26px", sm: "36px", md: "42px" },
                  color: "#ffffff",
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Need Medicine Refills or Specialist Support?
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Explore our full medicine store, track active prescriptions, manage your cart, and place orders with seamless cash on delivery or digital payment.
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Button
                  component={Link}
                  href="/dashboard/medicine"
                  variant="contained"
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    borderRadius: "9999px",
                    px: 3.5,
                    py: 1.2,
                    background: "linear-gradient(to right, #3b82f6, #10b981)",
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(to right, #2563eb, #059669)",
                    },
                  }}
                >
                  Browse Medicine Shop
                </Button>

                <Button
                  component={Link}
                  href="/dashboard/services"
                  variant="outlined"
                  sx={{
                    borderRadius: "9999px",
                    px: 3,
                    py: 1.2,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: "#ffffff",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.4)",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  View Healthcare Services
                </Button>
              </Box>
            </Box>

            {/* Feature Stat Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr" },
                gap: 2,
                width: { xs: "100%", md: "auto" },
                minWidth: { md: "280px" },
              }}
            >
              {[
                { label: "Guaranteed Genuine", val: "100%", color: "#38bdf8" },
                { label: "Happy Patients", val: "50,000+", color: "#34d399" },
                { label: "Dispatch Speed", val: "< 24 Hrs", color: "#fbbf24" },
                { label: "Support", val: "24/7 Live", color: "#f472b6" },
              ].map((stat, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2.5,
                    borderRadius: "20px",
                    backgroundColor: "rgba(15, 23, 42, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color, mb: 0.5 }}>
                    {stat.val}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.78rem" }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
