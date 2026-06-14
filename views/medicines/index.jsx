"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import { Pill, ShieldAlert } from "lucide-react";
import { CategoryService } from "../../services/categoryService/categoryService";
import { MedicineService } from "../../services/medicineService/medicineService";
import { useSearchParams } from "next/navigation";

export default function Medicine() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get("category");

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [medicinesLoading, setMedicinesLoading] = useState(false);

    // Fetch all active categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.getAllCategories("", "true");
                setCategories(data);
                if (categoryQuery) {
                    setSelectedCategory(categoryQuery);
                } else if (data.length > 0) {
                    // Set default selected category to the first one
                    setSelectedCategory(data[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, [categoryQuery]);

    // Fetch medicines when selected category changes
    useEffect(() => {
        if (!selectedCategory) return;

        const fetchMedicines = async () => {
            setMedicinesLoading(true);
            try {
                const data = await MedicineService.getMedicinesByCategory(selectedCategory);
                setMedicines(data.medicines || []);
            } catch (error) {
                console.error("Failed to fetch medicines for category:", error);
            } finally {
                setMedicinesLoading(false);
            }
        };

        fetchMedicines();
    }, [selectedCategory]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#020617", py: 8, color: "#ffffff" }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            background: "linear-gradient(to right, #3b82f6, #4ade80)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 2,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >
                        <Pill size={36} style={{ color: "#3b82f6" }} />
                        Explore Medicines
                    </Typography>
                    <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.55)", maxWidth: "600px", mx: "auto" }}>
                        Select a category to view the list of available medicines and healthcare items.
                    </Typography>
                </Box>

                {/* Category Selector */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 8 }}>
                    {categoriesLoading ? (
                        <Skeleton
                            variant="rectangular"
                            width={280}
                            height={56}
                            sx={{ borderRadius: "14px", bgcolor: "rgba(15, 23, 42, 0.5)" }}
                        />
                    ) : categories.length === 0 ? (
                        <Typography sx={{ color: "rgba(255,255,255,0.4)" }}>No categories available.</Typography>
                    ) : (
                        <FormControl
                            sx={{
                                width: "100%",
                                maxWidth: 400,
                                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.45)" },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" }
                            }}
                        >
                            <InputLabel id="category-select-label">Select Category</InputLabel>
                            <Select
                                labelId="category-select-label"
                                value={selectedCategory}
                                label="Select Category"
                                onChange={handleCategoryChange}
                                sx={{
                                    color: "#ffffff",
                                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "14px",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                                    "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.6)" }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                                            backdropFilter: "blur(16px)",
                                            border: "1px solid rgba(255, 255, 255, 0.1)",
                                            borderRadius: "14px",
                                            color: "#ffffff",
                                            "& .MuiMenuItem-root": {
                                                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                                                "&.Mui-selected": { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                                                "&.Mui-selected:hover": { backgroundColor: "rgba(59, 130, 246, 0.25)" }
                                            }
                                        }
                                    }
                                }}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>

                {/* Medicines List Grid */}
                {medicinesLoading ? (
                    <Grid container spacing={3.5}>
                        {[1, 2, 3].map((i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Skeleton
                                    variant="rectangular"
                                    height={300}
                                    sx={{ borderRadius: "20px", bgcolor: "rgba(15, 23, 42, 0.5)" }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : medicines.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 8,
                            borderRadius: "24px",
                            border: "1px dashed rgba(255, 255, 255, 0.12)",
                            backgroundColor: "rgba(15, 23, 42, 0.2)"
                        }}
                    >
                        <ShieldAlert size={44} style={{ color: "rgba(255,255,255,0.3)", marginBottom: "16px" }} />
                        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>
                            No Medicines Found
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
                            There are no medicines registered in this category.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3.5}>
                        {medicines.map((med) => (
                            <Grid item xs={12} sm={6} md={4} key={med._id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: "20px",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        backgroundColor: "rgba(15, 23, 42, 0.55)",
                                        backdropFilter: "blur(20px)",
                                        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        "&:hover": {
                                            transform: "translateY(-6px)",
                                            borderColor: "rgba(59, 130, 246, 0.4)",
                                            boxShadow: "0 20px 40px -15px rgba(59, 130, 246, 0.15)"
                                        }
                                    }}
                                >
                                    {/* Medicine Image wrapper */}
                                    <Box sx={{ position: "relative", height: "150px", backgroundColor: "rgba(30, 41, 59, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                        {med.image ? (
                                            <CardMedia
                                                component="img"
                                                image={med.image}
                                                alt={med.medicineName}
                                                sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <Pill size={48} style={{ color: "#3b82f6", opacity: 0.6 }} />
                                        )}
                                        {/* Stock status badge */}
                                        <Chip
                                            label={med.stock > 0 ? "In Stock" : "Out of Stock"}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 16,
                                                right: 16,
                                                fontWeight: 600,
                                                fontSize: "0.75rem",
                                                backgroundColor: med.stock > 0 ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                                border: `1px solid ${med.stock > 0 ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                                                color: med.stock > 0 ? "#4ade80" : "#f87171",
                                                backdropFilter: "blur(8px)"
                                            }}
                                        />
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 3 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: "#ffffff" }}>
                                            {med.medicineName}
                                        </Typography>

                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic", mb: 2 }}>
                                            {med.genericName}
                                        </Typography>

                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 3, lineBreak: "anywhere", flexGrow: 1 }}>
                                            {med.description || "No description available."}
                                        </Typography>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.08)", pt: 2.5 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: "#4ade80" }}>
                                                ₹{med.price}
                                            </Typography>

                                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)", fontWeight: 500 }}>
                                                Qty: {med.stock}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
