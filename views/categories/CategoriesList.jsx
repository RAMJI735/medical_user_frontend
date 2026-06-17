"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";
import { Sparkles, Activity, ChevronRight } from "lucide-react";
import { CategoryService } from "../../services/categoryService/categoryService";

export default function CategoriesList() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch only active categories
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
        <Box sx={{ py: 6, backgroundColor: "#020617", color: "#ffffff" }}>
            <Container maxWidth="lg">
                {/* Title and Intro */}
                <Box sx={{ textAlign: "center", mb: 5 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            background: "linear-gradient(to right, #3b82f6, #4ade80)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1.5,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1.2
                        }}
                    >
                        <Sparkles size={26} style={{ color: "#3b82f6" }} />
                        Shop by Category
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "rgba(255, 255, 255, 0.55)",
                            maxWidth: "500px",
                            mx: "auto",
                            fontSize: "0.95rem"
                        }}
                    >
                        Find the right medicines, wellness products, and healthcare essentials sorted for your convenience.
                    </Typography>
                </Box>

                {/* Categories Grid */}
                {loading ? (
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4].map((i) => (
                            <Grid xs={12} sm={6} md={3} key={i}>
                                <Skeleton
                                    variant="rectangular"
                                    height={200}
                                    sx={{ borderRadius: "16px", bgcolor: "rgba(15, 23, 42, 0.5)" }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : categories.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 5, color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
                        No active categories available at the moment.
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {categories.map((cat) => (
                            <Grid xs={12} sm={6} md={3} key={cat._id}>
                                <Link href={`/dashboard/medicine?category=${cat._id}`} style={{ textDecoration: "none" }}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            borderRadius: "18px",
                                            border: "1px solid rgba(255, 255, 255, 0.06)",
                                            backgroundColor: "rgba(15, 23, 42, 0.4)",
                                            backdropFilter: "blur(20px)",
                                            boxShadow: "0 8px 24px -12px rgba(0, 0, 0, 0.6)",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                borderColor: "rgba(59, 130, 246, 0.35)",
                                                boxShadow: "0 20px 40px -15px rgba(59, 130, 246, 0.12)",
                                                "& .category-img": {
                                                    transform: "scale(1.08)"
                                                },
                                                "& .hover-arrow": {
                                                    transform: "translateX(3px)",
                                                    color: "#4ade80"
                                                }
                                            }
                                        }}
                                    >
                                        {/* Image wrapper */}
                                        <Box sx={{ position: "relative", height: "110px", backgroundColor: "rgba(30, 41, 59, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                            {cat.image ? (
                                                <CardMedia
                                                    className="category-img"
                                                    component="img"
                                                    image={cat.image}
                                                    alt={cat.categoryName}
                                                    sx={{
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover",
                                                        transition: "transform 0.4s ease"
                                                    }}
                                                />
                                            ) : (
                                                <Activity size={36} style={{ color: "#3b82f6", opacity: 0.6 }} />
                                            )}
                                            {/* Subtle vignette overlay */}
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background: "linear-gradient(to top, rgba(2, 6, 23, 0.7) 0%, transparent 60%)"
                                                }}
                                            />
                                        </Box>

                                        {/* Content */}
                                        <CardContent sx={{ p: 2.2, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: "#ffffff",
                                                        mb: 0.5,
                                                        lineHeight: 1.2,
                                                        fontSize: "1.05rem"
                                                    }}
                                                >
                                                    {cat.categoryName}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: "rgba(255, 255, 255, 0.45)",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        lineHeight: 1.3,
                                                        fontSize: "0.78rem"
                                                    }}
                                                >
                                                    {cat.description || "Browse our range of quality healthcare products."}
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    mt: 2,
                                                    color: "#3b82f6",
                                                    fontSize: "0.8rem",
                                                    fontWeight: 600
                                                }}
                                            >
                                                <span>Explore</span>
                                                <ChevronRight className="hover-arrow" size={14} style={{ transition: "transform 0.3s ease" }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
