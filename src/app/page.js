"use client";

import Navbar from "../../views/navbar/Navbar";
import BannerCarousel from "../../views/homeBanner/BannerCarousel";
import CategoriesList from "../../views/categories/CategoriesList";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", width: "100%", backgroundColor: "#020617", overflowX: "hidden" }}>
      {/* Floating Navbar */}
      <Navbar />
      {/* Multi-banner Carousel */}
      <BannerCarousel />
      {/* Medical Categories List */}
      <CategoriesList />
    </Box>
  );
}
