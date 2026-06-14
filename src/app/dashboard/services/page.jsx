"use client";

import Navbar from "../../../../views/navbar/Navbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const servicesData = [
  { id: 1, title: "Wedding Planning", icon: "💍", description: "Complete wedding planning and coordination services to make your day perfect." },
  { id: 2, title: "Decoration", icon: "🌺", description: "Stunning floral and decor designs to create a magical atmosphere." },
  { id: 3, title: "Catering", icon: "🍽️", description: "Exquisite catering services with a variety of cuisines to delight your guests." },
  { id: 4, title: "Venue Selection", icon: "🏛️", description: "Professional assistance in choosing the perfect venue for your celebration." },
  { id: 5, title: "Event Management", icon: "📅", description: "End-to-end event management for all your wedding-related functions." },
  { id: 6, title: "Photography", icon: "📸", description: "Capturing your precious moments with professional photography services." }
];

export default function ServicesPage() { 
  return (
    <Box component="main" sx={{ minHeight: "100vh", backgroundColor: "#020617", color: "#ffffff", pt: 14, overflowX: "hidden" }}>
      {/* Navbar */}
      <Navbar />

      <Box component="section" id="services" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: "36px", md: "56px" },
              fontWeight: 700,
              mb: 2,
              letterSpacing: "-0.025em",
            }}
          >
            Our Services
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: { xs: "16px", md: "20px" },
              mb: 8,
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Comprehensive services tailored to make your wedding perfect
          </Typography>

          <Grid container spacing={4}>
            {servicesData.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.07)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ fontSize: "48px", mb: 3 }}>
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        letterSpacing: "0.025em",
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255, 255, 255, 0.75)",
                        lineHeight: 1.6,
                        fontSize: "14px",
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
