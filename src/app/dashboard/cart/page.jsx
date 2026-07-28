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
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
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
    Pill,
    MapPin,
    Check
} from "lucide-react";
import { AddressService } from "../../../../services/addressService/addressService";
import { OrderService } from "../../../../services/orderService/orderService";

export default function CartPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [cartData, setCartData] = useState({ cartItems: [], totalItems: 0, totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState({});

    // Checkout states
    const [openCheckout, setOpenCheckout] = useState(false);
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [placingOrder, setPlacingOrder] = useState(false);

    // New Address List states
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(false);

    const normalizeCartData = (data) => {
        if (!data) return { cartItems: [], totalItems: 0, totalPrice: 0 };
        const cart = data.cart !== undefined ? data.cart : data;
        if (!cart) return { cartItems: [], totalItems: 0, totalPrice: 0 };
        const cartItems = cart.medicines || data.cartItems || [];
        const totalItems = cart.totalItems !== undefined ? cart.totalItems : (data.totalItems || 0);
        const totalPrice = cart.totalAmount !== undefined ? cart.totalAmount : (data.totalPrice || 0);
        return { cartItems, totalItems, totalPrice };
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await CartService.getCart();
            setCartData(normalizeCartData(data));
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const data = await AddressService.getAddresses();
            const list = data || [];
            setAddresses(list);

            // Set selected address ID to default or first one
            const defaultAddress = list.find(addr => addr.selected);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress._id);
            } else if (list.length > 0) {
                setSelectedAddressId(list[0]._id);
            }

            // Show add address form by default if user has no saved addresses
            if (list.length === 0) {
                setShowAddAddressForm(true);
            } else {
                setShowAddAddressForm(false);
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/dashboard/login");
            } else {
                fetchCart();
                fetchAddresses();
            }
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (openCheckout && user) {
            fetchAddresses();
        }
    }, [openCheckout, user]);

    const handleQuantityChange = async (medicineId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;

        setUpdatingIds(prev => ({ ...prev, [medicineId]: true }));
        try {
            await CartService.updateCartItem(medicineId, newQty);
            // Refresh cart data
            const data = await CartService.getCart();
            setCartData(normalizeCartData(data));
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
            setCartData(normalizeCartData(data));
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

    const handleConfirmOrder = async (e) => {
        if (e) e.preventDefault();

        let addressId = selectedAddressId;

        if (showAddAddressForm) {
            if (!addressLine1 || !city || !state || !pincode) {
                toast.error("Please fill in all required address fields.");
                return;
            }
            if (!/^\d{6}$/.test(pincode)) {
                toast.error("Pincode must be a 6-digit number.");
                return;
            }
        } else {
            if (!addressId) {
                toast.error("Please select a delivery address.");
                return;
            }
        }

        setPlacingOrder(true);
        try {
            if (showAddAddressForm) {
                // 1. Create Address
                const addressRes = await AddressService.createAddress({
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    pincode
                });

                addressId = addressRes.address?._id || addressRes.data?.address?._id || addressRes._id;
                if (!addressId) {
                    throw new Error("Failed to get created address ID");
                }

                // Re-fetch addresses so the list is updated
                await fetchAddresses();
            }

            // 2. Create Order
            await OrderService.createOrder({
                addressId,
                paymentMethod: "COD"
            });

            toast.success("Order placed successfully!", { icon: "🎉" });
            setOpenCheckout(false);

            // Reset fields
            setAddressLine1("");
            setAddressLine2("");
            setCity("");
            setState("");
            setPincode("");

            // Re-fetch cart (which should now be empty)
            await fetchCart();

            // Redirect to orders page
            router.push("/dashboard/orders");
        } catch (error) {
            console.error("Failed to place order:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setPlacingOrder(false);
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
                                        onClick={() => setOpenCheckout(true)}
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

            {/* Checkout Dialog */}
            <Dialog
                open={openCheckout}
                onClose={() => {
                    if (!placingOrder) {
                        setOpenCheckout(false);
                        setShowAddAddressForm(addresses.length === 0);
                    }
                }}
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#0f172a !important",
                        color: "#ffffff !important",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "20px",
                        padding: 2,
                        maxWidth: "500px",
                        width: "100%"
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: "1.4rem", pb: 1 }}>
                    {showAddAddressForm ? "Shipping Details" : "Select Delivery Address"}
                </DialogTitle>
                <DialogContent>
                    {loadingAddresses ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress sx={{ color: "#3b82f6" }} />
                        </Box>
                    ) : !showAddAddressForm && addresses.length > 0 ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 1 }}>
                                Select a delivery address to place your Cash on Delivery (COD) order.
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: "300px", overflowY: "auto", pr: 1 }}>
                                {addresses.map((addr) => {
                                    const isSelected = selectedAddressId === addr._id;
                                    return (
                                        <Box
                                            key={addr._id}
                                            id={`address-card-${addr._id}`}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            sx={{
                                                p: 2.5,
                                                borderRadius: "16px",
                                                border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                                                backgroundColor: isSelected ? "rgba(59, 130, 246, 0.08)" : "rgba(15, 23, 42, 0.6)",
                                                cursor: "pointer",
                                                position: "relative",
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    borderColor: isSelected ? "#3b82f6" : "rgba(255, 255, 255, 0.2)",
                                                    backgroundColor: isSelected ? "rgba(59, 130, 246, 0.12)" : "rgba(15, 23, 42, 0.8)"
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                                <MapPin size={18} className={isSelected ? "text-blue-400" : "text-slate-400"} style={{ marginTop: "2px" }} />
                                                <Box sx={{ flexGrow: 1, pr: 6 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>
                                                        {addr.addressLine1}
                                                    </Typography>
                                                    {addr.addressLine2 && (
                                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 0.5, fontSize: "0.85rem" }}>
                                                            {addr.addressLine2}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.45)", mt: 0.5, fontSize: "0.85rem" }}>
                                                        {addr.city}, {addr.state} - {addr.pincode}
                                                    </Typography>
                                                </Box>
                                                {isSelected && (
                                                    <Box sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        backgroundColor: "#3b82f6",
                                                        color: "#ffffff"
                                                    }}>
                                                        <Check size={12} strokeWidth={3} />
                                                    </Box>
                                                )}
                                            </Box>
                                            {addr.selected && (
                                                <span style={{
                                                    position: "absolute",
                                                    top: "12px",
                                                    right: isSelected ? "36px" : "12px",
                                                    fontSize: "9px",
                                                    padding: "2px 6px",
                                                    backgroundColor: "rgba(74, 222, 128, 0.15)",
                                                    border: "1px solid rgba(74, 222, 128, 0.3)",
                                                    borderRadius: "4px",
                                                    color: "#4ade80",
                                                    fontWeight: 700,
                                                    textTransform: "uppercase"
                                                }}>
                                                    Default
                                                </span>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Button
                                fullWidth
                                variant="outlined"
                                id="btn-add-new-address"
                                startIcon={<Plus size={16} />}
                                onClick={() => {
                                    setAddressLine1("");
                                    setAddressLine2("");
                                    setCity("");
                                    setState("");
                                    setPincode("");
                                    setShowAddAddressForm(true);
                                }}
                                sx={{
                                    mt: 1,
                                    borderColor: "rgba(255, 255, 255, 0.12)",
                                    color: "rgba(255, 255, 255, 0.7)",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: "12px",
                                    py: 1.5,
                                    "&:hover": {
                                        borderColor: "#3b82f6",
                                        color: "#3b82f6",
                                        backgroundColor: "rgba(59, 130, 246, 0.05)"
                                    }
                                }}
                            >
                                Add New Address
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                            {addresses.length > 0 && (
                                <Button
                                    startIcon={<ArrowLeft size={16} />}
                                    onClick={() => setShowAddAddressForm(false)}
                                    id="btn-back-to-addresses"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.6)",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        mb: 3,
                                        alignSelf: "flex-start",
                                        "&:hover": {
                                            color: "#ffffff",
                                            backgroundColor: "rgba(255, 255, 255, 0.05)"
                                        }
                                    }}
                                >
                                    Back to Saved Addresses
                                </Button>
                            )}

                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 3 }}>
                                Please enter your delivery address to place your Cash on Delivery (COD) order.
                            </Typography>

                            <Box component="form" onSubmit={handleConfirmOrder} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                <TextField
                                    label="Address Line 1 *"
                                    variant="outlined"
                                    fullWidth
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    required
                                    disabled={placingOrder}
                                    InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                    inputProps={{ style: { color: "#ffffff" } }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
                                        }
                                    }}
                                />
                                <TextField
                                    label="Address Line 2 (Optional)"
                                    variant="outlined"
                                    fullWidth
                                    value={addressLine2}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                    disabled={placingOrder}
                                    InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                    inputProps={{ style: { color: "#ffffff" } }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
                                        }
                                    }}
                                />
                                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                    <TextField
                                        label="City *"
                                        variant="outlined"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                        disabled={placingOrder}
                                        InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                        inputProps={{ style: { color: "#ffffff" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                                "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
                                            }
                                        }}
                                    />
                                    <TextField
                                        label="State *"
                                        variant="outlined"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        required
                                        disabled={placingOrder}
                                        InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                        inputProps={{ style: { color: "#ffffff" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                                "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
                                            }
                                        }}
                                    />
                                </Box>
                                <TextField
                                    label="Pincode (6-Digits) *"
                                    variant="outlined"
                                    fullWidth
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    required
                                    disabled={placingOrder}
                                    placeholder="e.g. 226001"
                                    InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                    inputProps={{ style: { color: "#ffffff" }, maxLength: 6 }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
                                        }
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
                    <Button
                        onClick={() => {
                            setOpenCheckout(false);
                            setShowAddAddressForm(addresses.length === 0);
                        }}
                        disabled={placingOrder}
                        sx={{
                            color: "rgba(255,255,255,0.6)",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { color: "#ffffff", backgroundColor: "rgba(255,255,255,0.05)" }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmOrder}
                        disabled={placingOrder || (loadingAddresses && !showAddAddressForm) || (!showAddAddressForm && !selectedAddressId)}
                        variant="contained"
                        sx={{
                            background: "linear-gradient(to right, #3b82f6, #4ade80)",
                            textTransform: "none",
                            fontWeight: 700,
                            px: 3,
                            borderRadius: "10px",
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
                            "&:hover": {
                                background: "linear-gradient(to right, #2563eb, #22c55e)"
                            }
                        }}
                    >
                        {placingOrder ? "Placing Order..." : (showAddAddressForm ? "Confirm & Place Order" : "Place Order")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
