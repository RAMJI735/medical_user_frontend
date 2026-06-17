"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartService } from "../../../../services/cartService/cartService";
import { useAuth } from "../../../../services/authService/AuthContext";
import { toast } from "react-hot-toast";
import {
    Box,
    Container,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Tooltip,
    Divider,
    Card,
    CardContent
} from "@mui/material";
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    ShieldCheck,
    CreditCard,
    ShoppingBag,
    Pill
} from "lucide-react";

export default function CartPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [cartData, setCartData] = useState({ cartItems: [], totalItems: 0, totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState({});

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await CartService.getCart();
            setCartData(data || { cartItems: [], totalItems: 0, totalPrice: 0 });
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/dashboard/login");
            } else {
                fetchCart();
            }
        }
    }, [user, authLoading]);

    const handleQuantityChange = async (medicineId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;

        setUpdatingIds(prev => ({ ...prev, [medicineId]: true }));
        try {
            await CartService.updateCartItem(medicineId, newQty);
            // Refresh cart data
            const data = await CartService.getCart();
            setCartData(data || { cartItems: [], totalItems: 0, totalPrice: 0 });
        } catch (error) {
            console.error("Failed to update cart quantity:", error);
            toast.error(error.response?.data?.message || "Failed to update quantity");
        } finally {
            setUpdatingIds(prev => ({ ...prev, [medicineId]: false }));
        }
    };

    const handleRemoveItem = async (medicineId) => {
        if (!confirm("Are you sure you want to remove this item from your cart?")) return;

        setUpdatingIds(prev => ({ ...prev, [medicineId]: true }));
        try {
            await CartService.removeFromCart(medicineId);
            // Refresh cart data
            const data = await CartService.getCart();
            setCartData(data || { cartItems: [], totalItems: 0, totalPrice: 0 });
        } catch (error) {
            console.error("Failed to remove item:", error);
            toast.error(error.response?.data?.message || "Failed to remove item");
        } finally {
            setUpdatingIds(prev => ({ ...prev, [medicineId]: false }));
        }
    };

    const handleClearCart = async () => {
        if (!confirm("Are you sure you want to clear your entire cart?")) return;

        setLoading(true);
        try {
            await CartService.clearCart();
            setCartData({ cartItems: [], totalItems: 0, totalPrice: 0 });
            toast.success("Cart cleared successfully");
        } catch (error) {
            console.error("Failed to clear cart:", error);
            toast.error(error.response?.data?.message || "Failed to clear cart");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || (loading && cartData.cartItems.length === 0)) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#020617" }}>
                <CircularProgress sx={{ color: "#3b82f6" }} />
            </Box>
        );
    }

    const cartItems = cartData.cartItems || [];

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#020617", color: "#ffffff", pt: 16, pb: 10 }}>
            <Container maxWidth="lg">
                {/* Back Link */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        onClick={() => router.back()}
                        startIcon={<ArrowLeft size={16} />}
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            borderColor: "rgba(255, 255, 255, 0.15)",
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: "10px",
                            "&:hover": {
                                color: "#ffffff",
                                borderColor: "rgba(255, 255, 255, 0.3)",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }
                        }}
                        variant="outlined"
                    >
                        Back to Shop
                    </Button>
                </Box>

                {/* Page Title */}
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: "linear-gradient(to right, #3b82f6, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.025em" }}>
                    Shopping Cart
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.55)", mb: 5 }}>
                    Review your medical selection and manage active dosages.
                </Typography>

                {cartItems.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            py: 12,
                            px: 4,
                            borderRadius: "24px",
                            border: "1px dashed rgba(255, 255, 255, 0.12)",
                            backgroundColor: "rgba(15, 23, 42, 0.2)"
                        }}
                    >
                        <ShoppingCart size={64} className="text-slate-500 mb-6 opacity-80" />
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            Your cart is empty
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.45)", mb: 4, maxWidth: "400px" }}>
                            Explore our medical catalogs to add medicines, dosage forms, and healthcare products.
                        </Typography>
                        <Button
                            component={Link}
                            href="/dashboard/medicine"
                            variant="contained"
                            startIcon={<ShoppingBag size={18} />}
                            sx={{
                                background: "linear-gradient(to right, #3b82f6, #06b6d4)",
                                textTransform: "none",
                                fontWeight: 700,
                                px: 4,
                                py: 1.5,
                                borderRadius: "12px",
                                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.25)",
                                "&:hover": {
                                    background: "linear-gradient(to right, #2563eb, #0891b2)"
                                }
                            }}
                        >
                            Browse Medicines
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 4 }}>
                        {/* Cart Items List */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Items ({cartData.totalItems})
                                </Typography>
                                <Button
                                    onClick={handleClearCart}
                                    color="error"
                                    size="small"
                                    sx={{ textTransform: "none", fontWeight: 600 }}
                                >
                                    Clear Cart
                                </Button>
                            </Box>

                            {cartItems.map((item) => {
                                const med = item.medicineId || {};
                                const isUpdating = updatingIds[med._id];

                                return (
                                    <Box
                                        key={item._id}
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: { xs: "stretch", sm: "center" },
                                            justifyContent: "space-between",
                                            p: 3,
                                            borderRadius: "20px",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                            backgroundColor: "rgba(15, 23, 42, 0.4)",
                                            backdropFilter: "blur(12px)",
                                            gap: 3,
                                            opacity: isUpdating ? 0.7 : 1,
                                            pointerEvents: isUpdating ? "none" : "auto",
                                            transition: "opacity 0.2s ease"
                                        }}
                                    >
                                        {/* Product Details Section */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexGrow: 1 }}>
                                            {/* Image Thumbnail */}
                                            <Box sx={{ width: 64, height: 64, borderRadius: "12px", backgroundColor: "rgba(30, 41, 59, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                                                {med.image ? (
                                                    <img
                                                        src={med.image}
                                                        alt={med.medicineName}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <Pill className="text-blue-400" size={24} />
                                                )}
                                            </Box>
                                            
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#ffffff" }}>
                                                    {med.medicineName || "Unknown Medicine"}
                                                    {med.strength && (
                                                        <span style={{ marginLeft: "8px", fontSize: "11px", padding: "2px 6px", backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "4px", color: "#60a5fa" }}>
                                                            {med.strength}
                                                        </span>
                                                    )}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "12px", mt: 0.5 }}>
                                                    {med.genericName || "Generic Form"}
                                                </Typography>
                                                {med.manufacturer && (
                                                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.35)", display: "block", mt: 0.5, textTransform: "uppercase", fontWeight: 700, fontSize: "9px", letterSpacing: "0.05em" }}>
                                                        {med.manufacturer.brandName || med.manufacturer}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Quantity & Pricing Controls */}
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                                            {/* Quantity Selector */}
                                            <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.04)", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)", p: 0.5 }}>
                                                <IconButton
                                                    onClick={() => handleQuantityChange(med._id, item.quantity, -1)}
                                                    disabled={item.quantity <= 1}
                                                    size="small"
                                                    sx={{ color: "rgba(255, 255, 255, 0.6)", "&:hover": { color: "#ffffff" } }}
                                                >
                                                    <Minus size={14} />
                                                </IconButton>
                                                
                                                <Typography sx={{ mx: 2, fontWeight: 700, minWidth: "16px", textAlign: "center" }}>
                                                    {item.quantity}
                                                </Typography>
                                                
                                                <IconButton
                                                    onClick={() => handleQuantityChange(med._id, item.quantity, 1)}
                                                    disabled={med.stock <= item.quantity}
                                                    size="small"
                                                    sx={{ color: "rgba(255, 255, 255, 0.6)", "&:hover": { color: "#ffffff" } }}
                                                >
                                                    <Plus size={14} />
                                                </IconButton>
                                            </Box>

                                            {/* Pricing info */}
                                            <Box sx={{ minWidth: "90px", textAlign: "right" }}>
                                                <Typography sx={{ fontWeight: 800, color: "#4ade80", fontSize: "1.05rem" }}>
                                                    ₹{item.total}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)" }}>
                                                    ₹{item.price} each
                                                </Typography>
                                            </Box>

                                            {/* Delete button */}
                                            <Tooltip title="Remove Item">
                                                <IconButton
                                                    onClick={() => handleRemoveItem(med._id)}
                                                    color="error"
                                                    sx={{
                                                        backgroundColor: "rgba(239, 68, 68, 0.05)",
                                                        border: "1px solid rgba(239, 68, 68, 0.1)",
                                                        borderRadius: "10px",
                                                        p: 1.25,
                                                        "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.15)" }
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Order Summary Sidebar */}
                        <Box>
                            <Card
                                sx={{
                                    borderRadius: "24px",
                                    border: "1px solid rgba(255, 255, 255, 0.06)",
                                    backgroundColor: "rgba(15, 23, 42, 0.45)",
                                    backdropFilter: "blur(20px)",
                                    color: "#ffffff",
                                    p: 3,
                                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                                    position: "sticky",
                                    top: 100
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                                        Order Summary
                                    </Typography>

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.55)" }}>Subtotal</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{cartData.totalPrice}</Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.55)" }}>Shipping</Typography>
                                            <Typography variant="body2" sx={{ color: "#4ade80", fontWeight: 700 }}>FREE</Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.55)" }}>GST & Taxes</Typography>
                                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px" }}>Included</Typography>
                                        </Box>

                                        <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.08)" }} />

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Amount</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: "#3b82f6" }}>₹{cartData.totalPrice}</Typography>
                                        </Box>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<CreditCard size={18} />}
                                        sx={{
                                            mt: 4,
                                            background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                            textTransform: "none",
                                            fontWeight: 750,
                                            py: 1.75,
                                            borderRadius: "14px",
                                            fontSize: "1rem",
                                            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                                            "&:hover": {
                                                background: "linear-gradient(to right, #2563eb, #22c55e)",
                                                boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)"
                                            }
                                        }}
                                        onClick={() => toast("Checkout integration coming soon!", { icon: "💳" })}
                                    >
                                        Proceed to Checkout
                                    </Button>

                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 3, color: "rgba(255,255,255,0.4)" }}>
                                        <ShieldCheck size={14} className="text-emerald-400" />
                                        <Typography variant="caption" sx={{ fontSize: "11px" }}>
                                            Secure 256-bit SSL encrypted transaction.
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
