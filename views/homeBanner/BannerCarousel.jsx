"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  // Fetch dynamic banners from BannerService
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await BannerService.getBanners(true); // active banners only
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

  // Setup autoplay timer
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

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Helper to resolve background style (handles CSS gradient strings and standard image URLs)
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
    if (!bg) return { backgroundColor: "#1e293b" };

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
      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.05) 100%), url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  // Keyframes for premium fadeInUp entrance animation
  const fadeInUpAnimation = {
    "@keyframes fadeInUp": {
      "0%": {
        opacity: 0,
        transform: "translateY(24px)",
      },
      "100%": {
        opacity: 1,
        transform: "translateY(0)",
      },
    },
    animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
  };

  if (bannersList.length === 0) {
    return null;
  }

  const activeSlide = bannersList[activeIndex];

  // Map fields dynamically to handle both API model and static json structure
  const titleText = activeSlide.title;
  const descriptionText = activeSlide.subtitle || activeSlide.description || "";
  const linkUrl = activeSlide.button?.href || activeSlide.link;
  const buttonLabel = activeSlide.button?.label || "Explore More";

  return (
    <Box
      component="section"
      id="planning"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        pb: 14,
        px: 3,
        overflow: "hidden",
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

      {/* Premium Mesh Gradient Radial Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent, rgba(0,0,0,0.15))",
          mixBlendMode: "overlay",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Slide Content Container */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        {/* Render text inside a wrapper keyed by activeIndex to re-trigger transition animation on slide change */}
        <Box key={activeIndex} sx={fadeInUpAnimation}>
          <Typography
            variant="h1"
            sx={{
              color: "rgba(255, 255, 255, 0.95)",
              fontSize: { xs: "28px", sm: "40px", md: "52px" },
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
              maxWidth: "800px",
              mx: "auto",
              mb: 3,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.85), 0 4px 20px rgba(0, 0, 0, 0.4)",
            }}
          >
            {titleText}
          </Typography>

          {descriptionText && (
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "15px", sm: "17px", md: "19px" },
                fontWeight: 500,
                lineHeight: 1.6,
                maxWidth: "600px",
                mx: "auto",
                mb: 4,
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.95)",
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
              sx={{
                textTransform: "none",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#1e293b",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "0.625rem 2rem",
                borderRadius: "9999px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "#ffffff",
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.4)",
                },
              }}
            >
              {buttonLabel}
            </Button>
          )}
        </Box>
      </Container>

      {/* Navigation Arrow Controls */}
      {bannersList.length > 1 && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: "absolute",
              left: 24,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 15,
              color: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              display: { xs: "none", md: "inline-flex" },
              padding: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                transform: "translateY(-50%) scale(1.05)",
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
              right: 24,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 15,
              color: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              display: { xs: "none", md: "inline-flex" },
              padding: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                transform: "translateY(-50%) scale(1.05)",
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
            bottom: 28,
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
                backgroundColor: index === activeIndex ? "#ffffff" : "rgba(255, 255, 255, 0.35)",
                cursor: "pointer",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: index === activeIndex ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
