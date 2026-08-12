"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import staticBanners from "../../data/banner-list.json";
import { BannerService } from "../../services/bannerService/bannerService";

export default function BannerCarousel() {
  const [bannersList, setBannersList] = useState(staticBanners);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    if (bannersList.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % bannersList.length);
  }, [bannersList.length]);

  const prevSlide = useCallback(() => {
    if (bannersList.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + bannersList.length) % bannersList.length);
  }, [bannersList.length]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await BannerService.getBanners(true);
        if (data && data.length > 0) {
          setBannersList(data);
        }
      } catch (err) {
        console.error("Failed to load dynamic banners, using static fallbacks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!isPaused && bannersList.length > 0) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, nextSlide, bannersList.length]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:") ||
      imagePath.includes("linear-gradient")
    ) {
      return imagePath;
    }
    const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/").replace("/api/", "");
    return `${backendUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const getBackgroundStyle = (slide) => {
    if (!slide) return {};
    const bg = slide.background || slide.image;
    if (!bg) return { backgroundColor: "#020617" };

    if (
      bg.includes("linear-gradient") ||
      bg.includes("radial-gradient") ||
      bg.startsWith("rgb") ||
      bg.startsWith("#")
    ) {
      return { background: bg };
    }

    const imageUrl = getImageUrl(bg);
    return {
      backgroundImage: `linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.6) 50%, rgba(2, 6, 23, 0.3) 100%), url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  if (bannersList.length === 0) return null;

  const activeSlide = bannersList[activeIndex];
  const titleText = activeSlide.title;
  const descriptionText = activeSlide.subtitle || activeSlide.description || "";
  const linkUrl = activeSlide.button?.href || activeSlide.link || "/dashboard/medicine";
  const buttonLabel = activeSlide.button?.label || "Explore Products";

  return (
    <Box
      component="section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "75vh", sm: "80vh", md: "88vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pt: { xs: 12, sm: 14, md: 16 },
        pb: { xs: 8, sm: 10, md: 12 },
        px: { xs: 2, sm: 3 },
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Background Slides */}
      {bannersList.map((slide, index) => (
        <Box
          key={slide._id || slide.id || index}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: index === activeIndex ? 1 : 0,
            zIndex: index === activeIndex ? 1 : 0,
            transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: index === activeIndex ? "auto" : "none",
            ...getBackgroundStyle(slide),
          }}
        />
      ))}

      {/* Decorative Radial Lighting */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 20%, rgba(2, 6, 23, 0.8) 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Slide Content Card */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: "#ffffff",
          px: { xs: 2, sm: 4 },
          width: "100%",
        }}
      >
        <Box
          key={activeIndex}
          sx={{
            p: { xs: 3, sm: 5, md: 6 },
            borderRadius: "28px",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.15)",
            animation: "fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Badge indicator */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.6,
              borderRadius: "9999px",
              backgroundColor: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#38bdf8",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              fontWeight: 600,
              mb: 2.5,
            }}
          >
            <ShieldCheck size={16} />
            <span>Certified Healthcare & Express Delivery</span>
          </Box>

          <Typography
            variant="h1"
            sx={{
              color: "#ffffff",
              fontSize: { xs: "22px", sm: "34px", md: "48px" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: { xs: 1.25, md: 1.2 },
              maxWidth: "750px",
              mx: "auto",
              mb: { xs: 2, sm: 2.5 },
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            {titleText}
          </Typography>

          {descriptionText && (
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: { xs: "13px", sm: "16px", md: "18px" },
                fontWeight: 400,
                lineHeight: { xs: 1.5, md: 1.6 },
                maxWidth: "580px",
                mx: "auto",
                mb: { xs: 3, sm: 4 },
              }}
            >
              {descriptionText}
            </Typography>
          )}

          {linkUrl && (
            <Button
              component={Link}
              href={linkUrl}
              variant="contained"
              endIcon={<ArrowRight size={18} />}
              sx={{
                textTransform: "none",
                background: "linear-gradient(to right, #3b82f6, #10b981)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: "9999px",
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(to right, #2563eb, #059669)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 30px rgba(16, 185, 129, 0.4)",
                },
              }}
            >
              {buttonLabel}
            </Button>
          )}
        </Box>
      </Container>

      {/* Navigation Arrow Controls (Desktop) */}
      {bannersList.length > 1 && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: "absolute",
              left: { md: 24, lg: 40 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 15,
              color: "#ffffff",
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              display: { xs: "none", md: "inline-flex" },
              p: 1.5,
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.3)",
                borderColor: "#3b82f6",
              },
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: "absolute",
              right: { md: 24, lg: 40 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 15,
              color: "#ffffff",
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              display: { xs: "none", md: "inline-flex" },
              p: 1.5,
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.3)",
                borderColor: "#3b82f6",
              },
            }}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </IconButton>
        </>
      )}

      {/* Dynamic Slide Indicator Dots */}
      {bannersList.length > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 16, sm: 24 },
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1.5,
            zIndex: 12,
          }}
        >
          {bannersList.map((_, index) => (
            <Box
              key={index}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: index === activeIndex ? 28 : 8,
                height: 8,
                borderRadius: "9999px",
                backgroundColor: index === activeIndex ? "#38bdf8" : "rgba(255, 255, 255, 0.3)",
                cursor: "pointer",
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
