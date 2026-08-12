"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import { Search, Plus, FolderPlus, Trash2, ShieldAlert, Sparkles, Activity, ArrowLeft } from "lucide-react";
import { CategoryService } from "../../../../services/categoryService/categoryService";

export default function MedicalCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        categoryName: "",
        description: "",
        image: "",
        isActive: true,
        sortOrder: 0
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await CategoryService.getAllCategories(searchQuery);
            setCategories(data || []);
        } catch (error) {
            console.error("Failed to load categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCategories();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSubmitLoading(true);
        try {
            await CategoryService.createCategory(formData);
            setCreateDialogOpen(false);
            setFormData({
                categoryName: "",
                description: "",
                image: "",
                isActive: true,
                sortOrder: 0
            });
            fetchCategories();
        } catch (error) {
            console.error("Create category error:", error);
            setErrorMsg(error.response?.data?.message || "Failed to create category");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await CategoryService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.error("Delete category error:", error);
                alert(error.response?.data?.message || "Failed to delete category");
            }
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#020617", pt: { xs: 12, md: 14 }, pb: 10, color: "#ffffff" }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 4 }}>
                    <Box>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.5, borderRadius: "9999px", backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", color: "#38bdf8", fontSize: "0.85rem", fontWeight: 600, mb: 1.5 }}>
                            <Sparkles size={16} />
                            <span>Category Management</span>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff" }}>
                            Medical Segments & Categories
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 0.5 }}>
                            Manage prescription drug categories, active status, and sorting order.
                        </Typography>
                    </Box>

                    <Button
                        onClick={() => setCreateDialogOpen(true)}
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        sx={{
                            borderRadius: "9999px",
                            px: 3,
                            py: 1,
                            background: "linear-gradient(to right, #3b82f6, #10b981)",
                            fontWeight: 700,
                            textTransform: "none",
                            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                        }}
                    >
                        Add Category
                    </Button>
                </Box>

                {/* Search Bar */}
                <Box sx={{ mb: 5, maxWidth: "600px" }}>
                    <TextField
                        fullWidth
                        placeholder="Search medical categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={20} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
                                    </InputAdornment>
                                ),
                                style: { color: "#ffffff", fontSize: "0.95rem" }
                            }
                        }}
                        sx={{
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            borderRadius: "16px",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.1)" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.4)" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" }
                        }}
                    />
                </Box>

                {/* Categories Grid */}
                {loading ? (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} variant="rectangular" height={220} sx={{ borderRadius: "20px", bgcolor: "rgba(15, 23, 42, 0.5)" }} />
                        ))}
                    </Box>
                ) : categories.length === 0 ? (
                    <Box className="glass-panel" sx={{ p: 6, borderRadius: "24px", textAlign: "center" }}>
                        <ShieldAlert size={48} style={{ color: "rgba(255, 255, 255, 0.3)", marginBottom: 16 }} />
                        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
                            No categories registered yet
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3.5 }}>
                        {categories.map((cat) => (
                            <Box
                                key={cat._id}
                                className="glass-card"
                                sx={{
                                    borderRadius: "22px",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box sx={{ position: "relative", height: 130, backgroundColor: "rgba(30, 41, 59, 0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {cat.image ? (
                                        <Box component="img" src={cat.image} alt={cat.categoryName} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <Activity size={36} style={{ color: "#3b82f6" }} />
                                    )}
                                    <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                                        <Chip
                                            label={cat.isActive ? "Active" : "Inactive"}
                                            size="small"
                                            sx={{
                                                backgroundColor: cat.isActive ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)",
                                                color: "#ffffff",
                                                fontWeight: 700,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff", mb: 0.5 }}>
                                            {cat.categoryName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                                            {cat.description || "Certified healthcare segment."}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                        <Button
                                            component={Link}
                                            href={`/dashboard/medicine?category=${cat._id}`}
                                            size="small"
                                            sx={{ color: "#38bdf8", textTransform: "none", fontWeight: 600 }}
                                        >
                                            View Products
                                        </Button>
                                        <IconButton onClick={() => handleDeleteCategory(cat._id)} sx={{ color: "#ef4444" }}>
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Create Modal */}
                <Dialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    slotProps={{
                        paper: {
                            sx: {
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                backdropFilter: "blur(24px)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                borderRadius: "24px",
                                color: "#ffffff",
                                p: 1,
                            }
                        }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 800, color: "#ffffff" }}>
                        Create Medical Category
                    </DialogTitle>
                    <Box component="form" onSubmit={handleCreateCategory}>
                        <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.1)", display: "flex", flexDirection: "column", gap: 2 }}>
                            {errorMsg && (
                                <Box sx={{ p: 1.5, borderRadius: "10px", backgroundColor: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", color: "#f87171", fontSize: "0.85rem" }}>
                                    {errorMsg}
                                </Box>
                            )}

                            <TextField
                                label="Category Name"
                                required
                                fullWidth
                                value={formData.categoryName}
                                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                slotProps={{ htmlInput: { style: { color: "#fff" } } }}
                            />
                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                slotProps={{ htmlInput: { style: { color: "#fff" } } }}
                            />
                            <TextField
                                label="Image URL"
                                fullWidth
                                placeholder="https://example.com/image.jpg"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                slotProps={{ htmlInput: { style: { color: "#fff" } } }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Active Status"
                            />
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitLoading} variant="contained" sx={{ borderRadius: "12px", background: "linear-gradient(to right, #3b82f6, #10b981)" }}>
                                {submitLoading ? "Saving..." : "Save Category"}
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            </Container>
        </Box>
    );
}
