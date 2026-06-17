"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
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
import { Search, Plus, FolderPlus, Trash2, ShieldAlert, Sparkles, Activity } from "lucide-react";
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
            setCategories(data);
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
        <Box sx={{ minHeight: "100vh", backgroundColor: "#020617", py: 6, color: "#ffffff" }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 3, mb: 6 }}>
                    <Box>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-0.02em",
                                background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5
                            }}
                        >
                            <Sparkles size={36} style={{ color: "#3b82f6" }} />
                            Medical Categories
                        </Typography>
                        <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.55)" }}>
                            Manage all category categories for medicines and healthcare services.
                        </Typography>
                    </Box>
                    
                    <Button
                        variant="contained"
                        onClick={() => setCreateDialogOpen(true)}
                        startIcon={<Plus size={18} />}
                        sx={{
                            background: "linear-gradient(to right, #3b82f6, #4ade80)",
                            py: 1.5,
                            px: 3,
                            borderRadius: "12px",
                            fontWeight: 600,
                            textTransform: "none",
                            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                background: "linear-gradient(to right, #2563eb, #22c55e)",
                                boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
                                transform: "translateY(-2px)"
                            }
                        }}
                    >
                        New Category
                    </Button>
                </Box>

                {/* Filters Section */}
                <Box sx={{ mb: 5 }}>
                    <TextField
                        fullWidth
                        placeholder="Search categories by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ color: "rgba(255,255,255,0.4)" }}>
                                    <Search size={20} />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "#ffffff",
                                backgroundColor: "rgba(15, 23, 42, 0.6)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "14px",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                "& fieldset": { borderColor: "transparent" },
                                "&:hover fieldset": { borderColor: "transparent" },
                                "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
                            }
                        }}
                    />
                </Box>

                {/* Categories Grid */}
                {loading ? (
                    <Grid container spacing={3.5}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Grid xs={12} sm={6} md={4} key={i}>
                                <Skeleton 
                                    variant="rectangular" 
                                    height={240} 
                                    sx={{ borderRadius: "20px", bgcolor: "rgba(15, 23, 42, 0.5)" }} 
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : categories.length === 0 ? (
                    <Box 
                        sx={{ 
                            textAlign: "center", 
                            py: 10, 
                            borderRadius: "24px", 
                            border: "1px dashed rgba(255, 255, 255, 0.15)",
                            backgroundColor: "rgba(15, 23, 42, 0.2)"
                        }}
                    >
                        <ShieldAlert size={48} style={{ color: "rgba(255,255,255,0.3)", marginBottom: "16px" }} />
                        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                            No Categories Found
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)" }}>
                            Try searching for something else or create a new category.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3.5}>
                        {categories.map((cat) => (
                            <Grid xs={12} sm={6} md={4} key={cat._id}>
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
                                    {/* Category Image or Fallback */}
                                    <Box sx={{ position: "relative", height: "140px", backgroundColor: "rgba(30, 41, 59, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                        {cat.image ? (
                                            <CardMedia
                                                component="img"
                                                image={cat.image}
                                                alt={cat.categoryName}
                                                sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <Activity size={48} style={{ color: "#3b82f6", opacity: 0.7 }} />
                                        )}
                                        {/* Status Chip */}
                                        <Chip
                                            label={cat.isActive ? "Active" : "Inactive"}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: 16,
                                                right: 16,
                                                fontWeight: 600,
                                                fontSize: "0.75rem",
                                                backgroundColor: cat.isActive ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                                                border: `1px solid ${cat.isActive ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                                                color: cat.isActive ? "#4ade80" : "#f87171",
                                                backdropFilter: "blur(8px)"
                                            }}
                                        />
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 3 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: "#ffffff" }}>
                                            {cat.categoryName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.55)", mb: 3, lineBreak: "anywhere", flexGrow: 1 }}>
                                            {cat.description || "No description provided."}
                                        </Typography>
                                        
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.08)", pt: 2 }}>
                                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.35)", fontWeight: 500 }}>
                                                Order: {cat.sortOrder || 0}
                                            </Typography>
                                            
                                            <IconButton 
                                                onClick={() => handleDeleteCategory(cat._id)}
                                                sx={{ 
                                                    color: "rgba(239, 68, 68, 0.6)",
                                                    "&:hover": { color: "#ef4444", backgroundColor: "rgba(239, 68, 68, 0.08)" }
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Create Dialog */}
                <Dialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                    PaperProps={{
                        sx: {
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "24px",
                            color: "#ffffff",
                            maxWidth: "500px",
                            width: "100%",
                            p: 2
                        }
                    }}
                >
                    <form onSubmit={handleCreateCategory}>
                        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 1.5 }}>
                            <FolderPlus style={{ color: "#3b82f6" }} />
                            Create New Category
                        </DialogTitle>
                        
                        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 2 }}>
                            {errorMsg && (
                                <Box sx={{ p: 1.5, borderRadius: "10px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", fontSize: "0.875rem", textAlign: "center" }}>
                                    {errorMsg}
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                required
                                label="Category Name"
                                placeholder="e.g. Antibiotics"
                                value={formData.categoryName}
                                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                sx={dialogTextFieldStyle}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                placeholder="Write a short description..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                sx={dialogTextFieldStyle}
                            />

                            <TextField
                                fullWidth
                                label="Image URL"
                                placeholder="e.g. https://example.com/image.jpg"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                sx={dialogTextFieldStyle}
                            />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                                <TextField
                                    type="number"
                                    label="Sort Order"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                    sx={{ ...dialogTextFieldStyle, width: "120px" }}
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
                                    sx={{ color: "rgba(255,255,255,0.7)" }}
                                />
                            </Box>
                        </DialogContent>
                        
                        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                            <Button 
                                onClick={() => setCreateDialogOpen(false)}
                                sx={{ color: "rgba(255,255,255,0.6)", textTransform: "none", fontWeight: 600 }}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={submitLoading}
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    px: 3,
                                    "&:hover": {
                                        background: "linear-gradient(to right, #2563eb, #22c55e)"
                                    }
                                }}
                            >
                                {submitLoading ? "Creating..." : "Create Category"}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Container>
        </Box>
    );
}

const dialogTextFieldStyle = {
    "& .MuiOutlinedInput-root": {
        color: "#ffffff",
        "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
        },
        "&:hover fieldset": {
            borderColor: "rgba(255, 255, 255, 0.3)",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#3b82f6",
        },
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255, 255, 255, 0.45)",
        "&.Mui-focused": {
            color: "#3b82f6",
        },
    },
};
