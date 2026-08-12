'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CartService } from '../../../../services/cartService/cartService'
import { AddressService } from '../../../../services/addressService/addressService'
import { OrderService } from '../../../../services/orderService/orderService'
import { PaymentService } from '../../../../services/paymentService/paymentService'
import {
    Box,
    Container,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    TextField,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    CreditCard,
    ShoppingBag,
    Pill,
    MapPin,
    Check,
    Banknote,
    FileText,
    PackageCheck,
    Sparkles,
    CheckCircle2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CartPage() {
    const router = useRouter()
    const [cartItems, setCartItems] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [step, setStep] = useState("cart") // "cart" | "address" | "payment" | "success"

    // Address States
    const [addresses, setAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState("")
    const [showAddAddressForm, setShowAddAddressForm] = useState(false)
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [pincode, setPincode] = useState("")

    // Payment States
    const [paymentMethod, setPaymentMethod] = useState("COD") // "COD" or "Online"
    const [loading, setLoading] = useState(false)
    const [updatingIds, setUpdatingIds] = useState({})
    const [placedOrder, setPlacedOrder] = useState(null)

    const GetCart = async () => {
        try {
            const carts = await CartService.getCart();
            const cartData = carts?.cart || carts || {};
            setCartItems(cartData);

            const medicines = cartData?.medicines || [];
            const total = cartData?.totalAmount ?? medicines.reduce((acc, item) => {
                const price = item?.medicineId?.sellingPrice || item?.price || 0;
                return acc + (price * item.quantity);
            }, 0);
            setTotalAmount(total);
        } catch (error) {
            console.log(error, "GetCart Error");
        }
    }

    const GetAddresses = async () => {
        try {
            const data = await AddressService.getAddresses();
            const list = data || [];
            setAddresses(list);

            const defaultAddr = list.find(a => a.selected) || list[0];
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id);
            } else {
                setShowAddAddressForm(true);
            }
        } catch (error) {
            console.log(error, "GetAddresses Error");
        }
    }

    useEffect(() => {
        GetCart();
        GetAddresses();
    }, []);

    const handleRemoveItem = async (medicineId) => {
        setUpdatingIds(prev => ({ ...prev, [medicineId]: true }));
        try {
            await CartService.removeFromCart(medicineId);
            toast.success("Item removed from cart");
            GetCart();
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("cart-updated"));
            }
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setUpdatingIds(prev => ({ ...prev, [medicineId]: false }));
        }
    };

    const handleQuantityChange = async (medicineId, newQty) => {
        if (newQty < 1) return;
        setUpdatingIds(prev => ({ ...prev, [medicineId]: true }));
        try {
            await CartService.updateCartItem(medicineId, newQty);
            GetCart();
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("cart-updated"));
            }
        } catch (error) {
            toast.error("Failed to update quantity");
        } finally {
            setUpdatingIds(prev => ({ ...prev, [medicineId]: false }));
        }
    };

    const handleAddAddress = async (e) => {
        if (e) e.preventDefault();
        if (!addressLine1 || !city || !state || !pincode) {
            toast.error("Please fill all required address fields");
            return null;
        }

        try {
            const res = await AddressService.createAddress({
                addressLine1,
                addressLine2,
                city,
                state,
                pincode
            });
            const newId = res.address?._id || res._id;
            toast.success("Delivery address saved!");
            await GetAddresses();
            setSelectedAddressId(newId);
            setShowAddAddressForm(false);
            setAddressLine1("");
            setAddressLine2("");
            setCity("");
            setState("");
            setPincode("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add address");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Please select or add a delivery address");
            setStep("address");
            return;
        }

        setLoading(true);
        try {
            const orderRes = await OrderService.createOrder({
                addressId: selectedAddressId,
                paymentMethod: paymentMethod
            });

            const order = orderRes.order || orderRes;
            setPlacedOrder(order);

            if (paymentMethod === "Online") {
                toast.success("Simulating secure digital payment gateway...");
                await new Promise(r => setTimeout(r, 1200));
            }

            toast.success("Order placed successfully! Thank you for choosing Healthcare Expert.");
            setStep("success");
            GetCart();
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("cart-updated"));
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const medicinesList = cartItems?.medicines || [];

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#020617", color: "#ffffff", pt: { xs: 12, md: 14 }, pb: 10 }}>
            <Container maxWidth="lg">
                {/* Header Title */}
                <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                            {step === "cart" && "Shopping Cart"}
                            {step === "address" && "Delivery Address"}
                            {step === "payment" && "Payment & Review"}
                            {step === "success" && "Order Confirmation"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 0.5 }}>
                            {step === "cart" && "Review medicines and update item quantities before checkout."}
                            {step === "address" && "Choose or add your preferred delivery destination."}
                            {step === "payment" && "Select payment mode and place your order."}
                            {step === "success" && "Your healthcare order has been registered and is being processed."}
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href="/dashboard/medicine"
                        startIcon={<ArrowLeft size={16} />}
                        sx={{
                            color: "#38bdf8",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { backgroundColor: "rgba(56, 189, 248, 0.1)" }
                        }}
                    >
                        Back to Shop
                    </Button>
                </Box>

                {/* Progress Multi-Step Tracker Bar */}
                <Box
                    className="glass-panel"
                    sx={{
                        p: 2.5,
                        borderRadius: "20px",
                        mb: 5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    {[
                        { id: "cart", label: "1. Cart Review", icon: <ShoppingCart size={18} /> },
                        { id: "address", label: "2. Shipping Address", icon: <MapPin size={18} /> },
                        { id: "payment", label: "3. Payment & Submit", icon: <CreditCard size={18} /> },
                    ].map((st, idx) => {
                        const isCurrent = step === st.id;
                        const isCompleted = (step === "address" && idx === 0) || (step === "payment" && idx <= 1) || (step === "success");
                        return (
                            <Box
                                key={st.id}
                                onClick={() => {
                                    if (step !== "success") setStep(st.id);
                                }}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: "12px",
                                    cursor: step !== "success" ? "pointer" : "default",
                                    backgroundColor: isCurrent ? "rgba(59, 130, 246, 0.2)" : isCompleted ? "rgba(16, 185, 129, 0.15)" : "transparent",
                                    border: isCurrent ? "1px solid #3b82f6" : isCompleted ? "1px solid #10b981" : "1px solid transparent",
                                    color: isCurrent ? "#38bdf8" : isCompleted ? "#34d399" : "rgba(255, 255, 255, 0.5)",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {isCompleted ? <CheckCircle2 size={18} /> : st.icon}
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                                    {st.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>

                {/* Main Content Layout */}
                {step === "success" ? (
                    /* Success Step Screen */
                    <Box
                        className="glass-panel"
                        sx={{
                            p: { xs: 4, sm: 6 },
                            borderRadius: "28px",
                            textAlign: "center",
                            maxWidth: "650px",
                            mx: "auto",
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                backgroundColor: "rgba(16, 185, 129, 0.2)",
                                color: "#34d399",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 3,
                                boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
                            }}
                        >
                            <PackageCheck size={44} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", mb: 1 }}>
                            Order Placed Successfully!
                        </Typography>
                        <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 3 }}>
                            Your order reference ID is <strong style={{ color: "#38bdf8" }}>#{placedOrder?._id || "HLTH-" + Math.floor(100000 + Math.random() * 900000)}</strong>.
                        </Typography>

                        <Box sx={{ p: 3, borderRadius: "16px", backgroundColor: "rgba(15, 23, 42, 0.6)", mb: 4, textAlign: "left" }}>
                            <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 1 }}>
                                Summary
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <span>Total Amount Paid/Due:</span>
                                <strong style={{ color: "#34d399" }}>₹{placedOrder?.totalAmount || totalAmount}</strong>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Payment Mode:</span>
                                <strong style={{ color: "#ffffff" }}>{paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</strong>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                            <Button
                                component={Link}
                                href="/dashboard/orders"
                                variant="contained"
                                sx={{
                                    borderRadius: "9999px",
                                    px: 4,
                                    py: 1.2,
                                    background: "linear-gradient(to right, #3b82f6, #10b981)",
                                    fontWeight: 700,
                                    textTransform: "none",
                                }}
                            >
                                Track My Orders
                            </Button>
                            <Button
                                component={Link}
                                href="/dashboard/medicine"
                                variant="outlined"
                                sx={{
                                    borderRadius: "9999px",
                                    px: 3,
                                    py: 1.2,
                                    borderColor: "rgba(255, 255, 255, 0.2)",
                                    color: "#ffffff",
                                    textTransform: "none",
                                }}
                            >
                                Continue Shopping
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 4 }}>
                        {/* Step Left Area */}
                        <Box>
                            {step === "cart" && (
                                <Box>
                                    {medicinesList.length === 0 ? (
                                        <Box className="glass-panel" sx={{ p: 6, borderRadius: "24px", textAlign: "center" }}>
                                            <ShoppingCart size={48} style={{ color: "rgba(255, 255, 255, 0.3)", marginBottom: 16 }} />
                                            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
                                                Your cart is currently empty
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 1, mb: 3 }}>
                                                Explore our range of medicines and daily wellness essentials.
                                            </Typography>
                                            <Button
                                                component={Link}
                                                href="/dashboard/medicine"
                                                variant="contained"
                                                sx={{
                                                    borderRadius: "9999px",
                                                    px: 4,
                                                    py: 1.2,
                                                    background: "linear-gradient(to right, #3b82f6, #10b981)",
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                }}
                                            >
                                                Start Shopping
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            {medicinesList.map((item) => {
                                                const med = item.medicineId || {};
                                                const medId = med._id || item._id;
                                                const price = med.sellingPrice || item.price || 0;
                                                const itemTotal = price * item.quantity;
                                                const isUpdating = updatingIds[medId];

                                                return (
                                                    <Box
                                                        key={medId}
                                                        className="glass-card"
                                                        sx={{
                                                            p: 2.5,
                                                            borderRadius: "20px",
                                                            display: "flex",
                                                            flexDirection: { xs: "column", sm: "row" },
                                                            alignItems: { xs: "flex-start", sm: "center" },
                                                            justifyContent: "space-between",
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                            <Box
                                                                component="img"
                                                                src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300"}
                                                                alt={med.medicineName || "Medicine"}
                                                                sx={{ width: 70, height: 70, borderRadius: "14px", objectFit: "cover", backgroundColor: "#020617" }}
                                                            />
                                                            <Box>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>
                                                                    {med.medicineName || "Unknown Medicine"}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block", mt: 0.5 }}>
                                                                    {med.dosageForm || "Tablet"} • ₹{price} per unit
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: { xs: "100%", sm: "auto" }, gap: 3 }}>
                                                            {/* Quantity selector */}
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, backgroundColor: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", p: 0.5 }}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleQuantityChange(medId, item.quantity - 1)}
                                                                    disabled={isUpdating || item.quantity <= 1}
                                                                    sx={{ color: "#ffffff" }}
                                                                >
                                                                    <Minus size={14} />
                                                                </IconButton>
                                                                <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                                                                    {item.quantity}
                                                                </Typography>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleQuantityChange(medId, item.quantity + 1)}
                                                                    disabled={isUpdating}
                                                                    sx={{ color: "#ffffff" }}
                                                                >
                                                                    <Plus size={14} />
                                                                </IconButton>
                                                            </Box>

                                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#34d399", minWidth: 80, textAlign: "right" }}>
                                                                ₹{itemTotal}
                                                            </Typography>

                                                            <IconButton
                                                                onClick={() => handleRemoveItem(medId)}
                                                                disabled={isUpdating}
                                                                sx={{ color: "#ef4444", "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.15)" } }}
                                                            >
                                                                <Trash2 size={18} />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {step === "address" && (
                                <Box className="glass-panel" sx={{ p: 4, borderRadius: "24px" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff" }}>
                                            Select Shipping Address
                                        </Typography>
                                        <Button
                                            onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                                            variant="outlined"
                                            size="small"
                                            sx={{ borderRadius: "9999px", textTransform: "none", color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.4)" }}
                                        >
                                            {showAddAddressForm ? "Cancel" : "+ Add New Address"}
                                        </Button>
                                    </Box>

                                    {showAddAddressForm && (
                                        <Box component="form" onSubmit={handleAddAddress} sx={{ p: 3, borderRadius: "16px", backgroundColor: "rgba(15, 23, 42, 0.8)", mb: 4 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: "#ffffff" }}>
                                                New Delivery Destination
                                            </Typography>
                                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 2 }}>
                                                <TextField
                                                    label="Address Line 1"
                                                    value={addressLine1}
                                                    onChange={(e) => setAddressLine1(e.target.value)}
                                                    required
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    slotProps={{ htmlInput: { style: { color: "#fff" } } }}
                                                />
                                                <TextField
                                                    label="Address Line 2 (Optional)"
                                                    value={addressLine2}
                                                    onChange={(e) => setAddressLine2(e.target.value)}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    slotProps={{ htmlInput: { style: { color: "#fff" } } }}
                                                />
                                                <TextField
                                                    label="City"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    required
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    slotProps={{ htmlInput: { style: { color: "#fff" } } }}
                                                />
                                                <TextField
                                                    label="State"
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                    required
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    slotProps={{ htmlInput: { style: { color: "#fff" } } }}
                                                />
                                                <TextField
                                                    label="Pincode"
                                                    value={pincode}
                                                    onChange={(e) => setPincode(e.target.value)}
                                                    required
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    slotProps={{ htmlInput: { style: { color: "#fff" } } }}
                                                />
                                            </Box>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={{ borderRadius: "12px", background: "#3b82f6", textTransform: "none", fontWeight: 600 }}
                                            >
                                                Save Address
                                            </Button>
                                        </Box>
                                    )}

                                    {addresses.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                                            No saved addresses found. Please add a delivery address above.
                                        </Typography>
                                    ) : (
                                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                                            {addresses.map((addr) => {
                                                const isSelected = selectedAddressId === addr._id;
                                                return (
                                                    <Box
                                                        key={addr._id}
                                                        onClick={() => setSelectedAddressId(addr._id)}
                                                        sx={{
                                                            p: 2.5,
                                                            borderRadius: "16px",
                                                            border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                                                            backgroundColor: isSelected ? "rgba(59, 130, 246, 0.15)" : "rgba(15, 23, 42, 0.5)",
                                                            cursor: "pointer",
                                                            transition: "all 0.2s ease",
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                <MapPin size={16} className={isSelected ? "text-blue-400" : "text-slate-400"} />
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff" }}>
                                                                    {addr.city}, {addr.state}
                                                                </Typography>
                                                            </Box>
                                                            {isSelected && <Check size={16} style={{ color: "#38bdf8" }} />}
                                                        </Box>
                                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                                                            {addr.addressLine1} {addr.addressLine2 && `, ${addr.addressLine2}`}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)", display: "block", mt: 0.5 }}>
                                                            PIN: {addr.pincode}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {step === "payment" && (
                                <Box className="glass-panel" sx={{ p: 4, borderRadius: "24px" }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff", mb: 3 }}>
                                        Select Payment Option
                                    </Typography>

                                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5, mb: 4 }}>
                                        <Box
                                            onClick={() => setPaymentMethod("COD")}
                                            sx={{
                                                p: 3,
                                                borderRadius: "18px",
                                                border: paymentMethod === "COD" ? "2px solid #10b981" : "1px solid rgba(255, 255, 255, 0.08)",
                                                backgroundColor: paymentMethod === "COD" ? "rgba(16, 185, 129, 0.15)" : "rgba(15, 23, 42, 0.5)",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            <Banknote size={28} className={paymentMethod === "COD" ? "text-emerald-400" : "text-slate-400"} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#ffffff", mt: 1.5 }}>
                                                Cash on Delivery (COD)
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block", mt: 0.5 }}>
                                                Pay in cash upon physical doorstep delivery.
                                            </Typography>
                                        </Box>

                                        <Box
                                            onClick={() => setPaymentMethod("Online")}
                                            sx={{
                                                p: 3,
                                                borderRadius: "18px",
                                                border: paymentMethod === "Online" ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                                                backgroundColor: paymentMethod === "Online" ? "rgba(59, 130, 246, 0.15)" : "rgba(15, 23, 42, 0.5)",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            <CreditCard size={28} className={paymentMethod === "Online" ? "text-blue-400" : "text-slate-400"} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#ffffff", mt: 1.5 }}>
                                                Online Card / UPI Payment
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", display: "block", mt: 0.5 }}>
                                                Instant digital payment via credit card or UPI.
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {/* Order Summary Sidebar */}
                        <Box>
                            <Box className="glass-panel" sx={{ p: 3.5, borderRadius: "24px", position: "sticky", top: 120 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff", mb: 2 }}>
                                    Order Summary
                                </Typography>

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem", mb: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>Items ({medicinesList.length}):</span>
                                        <strong style={{ color: "#ffffff" }}>₹{totalAmount}</strong>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>Express Shipping:</span>
                                        <strong style={{ color: "#34d399" }}>FREE</strong>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>Prescription Verification:</span>
                                        <strong style={{ color: "#34d399" }}>Verified</strong>
                                    </Box>
                                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />
                                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>
                                        <span>Total Payable:</span>
                                        <span style={{ color: "#34d399" }}>₹{totalAmount}</span>
                                    </Box>
                                </Box>

                                {step === "cart" && (
                                    <Button
                                        onClick={() => {
                                            if (medicinesList.length === 0) {
                                                toast.error("Your cart is empty");
                                                return;
                                            }
                                            setStep("address");
                                        }}
                                        disabled={medicinesList.length === 0}
                                        fullWidth
                                        variant="contained"
                                        endIcon={<ArrowRight size={18} />}
                                        sx={{
                                            py: 1.4,
                                            borderRadius: "14px",
                                            background: "linear-gradient(to right, #3b82f6, #10b981)",
                                            fontWeight: 700,
                                            textTransform: "none",
                                        }}
                                    >
                                        Proceed to Address
                                    </Button>
                                )}

                                {step === "address" && (
                                    <Button
                                        onClick={() => {
                                            if (!selectedAddressId) {
                                                toast.error("Please select a delivery address");
                                                return;
                                            }
                                            setStep("payment");
                                        }}
                                        fullWidth
                                        variant="contained"
                                        endIcon={<ArrowRight size={18} />}
                                        sx={{
                                            py: 1.4,
                                            borderRadius: "14px",
                                            background: "linear-gradient(to right, #3b82f6, #10b981)",
                                            fontWeight: 700,
                                            textTransform: "none",
                                        }}
                                    >
                                        Proceed to Payment
                                    </Button>
                                )}

                                {step === "payment" && (
                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            py: 1.4,
                                            borderRadius: "14px",
                                            background: "linear-gradient(to right, #10b981, #059669)",
                                            fontWeight: 700,
                                            textTransform: "none",
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm & Place Order"}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
}