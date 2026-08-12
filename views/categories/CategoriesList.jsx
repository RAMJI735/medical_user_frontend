"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";
import { Sparkles, Activity, ChevronRight, PackageCheck, Pill } from "lucide-react";
import { CategoryService } from "../../services/categoryService/categoryService";

export default function CategoriesList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.getAllCategories("", "true");
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories for home page:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Box component="section" sx={{ py: { xs: 8, md: 12 }, backgroundColor: "#020617", color: "#ffffff" }}>
            <Container maxWidth="lg">
                {/* Title and Intro */}
                <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            px: 2,
                            py: 0.5,
                            borderRadius: "9999px",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            border: "1px solid rgba(59, 130, 246, 0.25)",
                            color: "#38bdf8",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            mb: 2,
                        }}
                    >
                        <Sparkles size={16} />
                        <span>Curated Healthcare Segments</span>
                    </Box>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            fontSize: { xs: "28px", sm: "36px", md: "44px" },
                            background: "linear-gradient(to right, #ffffff, #94a3b8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1.5,
                        }}
                    >
                        Shop by Medical Category
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            maxWidth: "540px",
                            mx: "auto",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            lineHeight: 1.6,
                        }}
                    >
                        Browse authentic medicines, daily wellness supplements, and specialized diagnostic supplies.
                    </Typography>
                </Box>

                {/* Categories Responsive Grid */}
                {loading ? (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3 }}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                height={240}
                                sx={{ borderRadius: "20px", bgcolor: "rgba(15, 23, 42, 0.5)" }}
                            />
                        ))}
                    </Box>
                ) : categories.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8, color: "rgba(255,255,255,0.4)", fontSize: "0.95rem" }}>
                        No active categories available at the moment.
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
                            gap: 3,
                        }}
                    >
                        {categories.map((cat) => (
                            <Link key={cat._id} href={`/dashboard/medicine?category=${cat._id}`} style={{ textDecoration: "none" }}>
                                <Box
                                    className="glass-card"
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: "22px",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        position: "relative",
                                        "&:hover": {
                                            "& .cat-bg-img": { transform: "scale(1.08)" },
                                            "& .hover-arrow": { transform: "translateX(4px)", color: "#38bdf8" },
                                        },
                                    }}
                                >
                                    {/* Image / Header Wrapper */}
                                    <Box
                                        sx={{
                                            position: "relative",
                                            height: "140px",
                                            backgroundColor: "rgba(30, 41, 59, 0.4)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {cat.image ? (
                                            <Box
                                                component="img"
                                                className="cat-bg-img"
                                                src={cat.image}
                                                alt={cat.categoryName}
                                                sx={{
                                                    height: "100%",
                                                    width: "100%",
                                                    objectFit: "cover",
                                                    transition: "transform 0.4s ease",
                                                }}
                                            />
                                        ) : (
                                            <Box sx={{ p: 2, borderRadius: "50%", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>
                                                <Activity size={36} />
                                            </Box>
                                        )}

                                        {/* Gradient Overlay */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 70%)",
                                            }}
                                        />
                                    </Box>

                                    {/* Content Info */}
                                    <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyBetween: "space-between" }}>
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#ffffff",
                                                    mb: 0.75,
                                                    fontSize: "1.1rem",
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {cat.categoryName}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "rgba(255, 255, 255, 0.55)",
                                                    fontSize: "0.825rem",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {cat.description || "Explore our certified range of quality medical products."}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                mt: 2.5,
                                                color: "#38bdf8",
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            <span>Browse Category</span>
                                            <ChevronRight className="hover-arrow" size={16} style={{ transition: "transform 0.3s ease" }} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Link>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
