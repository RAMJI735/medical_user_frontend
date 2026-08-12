"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { 
  Truck, 
  ShieldCheck, 
  Stethoscope, 
  Clock, 
  HeartPulse, 
  FileCheck2, 
  Sparkles,
  ArrowRight
} from "lucide-react";

const healthcareServices = [
  { 
    id: 1, 
    title: "Express Prescription Delivery", 
    icon: <Truck size={36} className="text-blue-400" />, 
    description: "Get genuine prescription drugs and OTC medicines delivered straight to your home within 24 hours." 
  },
  { 
    id: 2, 
    title: "Verified Pharmacist Consult", 
    icon: <Stethoscope size={36} className="text-emerald-400" />, 
    description: "Chat with licensed pharmacists for dosage guidance, generic alternatives, and drug interaction advice." 
  },
  { 
    id: 3, 
    title: "Prescription Scan & Verification", 
    icon: <FileCheck2 size={36} className="text-cyan-400" />, 
    description: "Upload doctor prescriptions online for instant digital verification by certified medical reviewers." 
  },
  { 
    id: 4, 
    title: "Automatic Refill Subscriptions", 
    icon: <Clock size={36} className="text-amber-400" />, 
    description: "Never run out of chronic care medications. Set monthly refill schedules for seamless delivery." 
  },
  { 
    id: 5, 
    title: "Diagnostic & First Aid Kits", 
    icon: <HeartPulse size={36} className="text-rose-400" />, 
    description: "Equip your home with blood pressure monitors, glucometers, thermometers, and emergency kits." 
  },
  { 
    id: 6, 
    title: "100% Quality Assurance", 
    icon: <ShieldCheck size={36} className="text-indigo-400" />, 
    description: "All products undergo strict temperature-controlled storage and lot verification protocols." 
  }
];

export default function ServicesPage() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", backgroundColor: "#020617", color: "#ffffff", pt: { xs: 12, md: 16 }, pb: 12, overflowX: "hidden" }}>
      <Container maxWidth="lg">
        {/* Header Intro */}
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: "9999px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#38bdf8",
              fontSize: "0.85rem",
              fontWeight: 600,
              mb: 2,
            }}
          >
            <Sparkles size={16} />
            <span>Digital Healthcare Solutions</span>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "32px", sm: "42px", md: "52px" },
              fontWeight: 800,
              mb: 2,
              letterSpacing: "-0.025em",
              background: "linear-gradient(to right, #ffffff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Healthcare Services
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.65)",
              fontSize: { xs: "15px", md: "18px" },
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Comprehensive digital pharmacy and home wellness solutions designed for speed, safety, and care.
          </Typography>
        </Box>

        {/* Services Responsive Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 3.5,
            mb: 8,
          }}
        >
          {healthcareServices.map((service) => (
            <Box
              key={service.id}
              className="glass-card"
              sx={{
                p: 4,
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box>
                <Box sx={{ mb: 3 }}>
                  {service.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    color: "#ffffff",
                    fontSize: "1.25rem",
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.65)",
                    lineHeight: 1.6,
                    fontSize: "0.9rem",
                  }}
                >
                  {service.description}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  component={Link}
                  href="/dashboard/medicine"
                  endIcon={<ArrowRight size={16} />}
                  sx={{
                    color: "#38bdf8",
                    p: 0,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.85rem",
                    "&:hover": { backgroundColor: "transparent", color: "#ffffff" },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Action Callout */}
        <Box
          className="glass-panel"
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: "28px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", mb: 1.5 }}>
            Ready to Order Prescription Refills?
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)", maxWidth: "540px", mx: "auto", mb: 4 }}>
            Explore our medicine shop, upload prescriptions, and enjoy doorstep delivery across all orders.
          </Typography>
          <Button
            component={Link}
            href="/dashboard/medicine"
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            sx={{
              borderRadius: "9999px",
              px: 4,
              py: 1.4,
              background: "linear-gradient(to right, #3b82f6, #10b981)",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Visit Medicine Shop Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
