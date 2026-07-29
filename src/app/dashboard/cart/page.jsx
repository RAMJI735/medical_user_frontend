'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CartService } from '../../../../services/cartService/cartService'
import { AddressService } from '../../../../services/addressService/addressService'
import { OrderService } from '../../../../services/orderService/orderService'
import { PaymentService } from '../../../../services/paymentService/paymentService'
import { CleanHands } from '@mui/icons-material'
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
    TextField,
    Chip
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
    Sparkles
} from 'lucide-react'
import { toast } from 'react-hot-toast'

function page() {
    const router = useRouter()
    const [cartItems, setCartItems] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [step, setStep] = useState("cart")

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
            console.log(error, "GetCart Error")
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
            toast.success("Address added successfully");
            await GetAddresses();
            setSelectedAddressId(newId);
            setShowAddAddressForm(false);
            return newId;
        } catch (error) {
            toast.error("Failed to add address");
            return null;
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (typeof window !== "undefined" && window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        let addressId = selectedAddressId;

        if (showAddAddressForm) {
            addressId = await handleAddAddress();
            if (!addressId) return;
        }

        if (!addressId) {
            toast.error("Please select a delivery address");
            return;
        }

        setLoading(true);
        try {
            if (paymentMethod === "COD") {
                await OrderService.createOrder({
                    addressId,
                    paymentMethod: "Cash on Delivery (COD)"
                });
                toast.success("Order placed successfully with Cash on Delivery!", { icon: "🎉" });
                GetCart();
                router.push("/dashboard/orders");
            } else {
                // Online Payment via Razorpay (create Razorpay order directly from Cart)
                const scriptLoaded = await loadRazorpayScript();
                if (!scriptLoaded) {
                    toast.error("Failed to load Razorpay SDK");
                    setLoading(false);
                    return;
                }

                try {
                    const paymentRes = await PaymentService.createPaymentOrder({ addressId });
                    const options = {
                        key: paymentRes?.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                        amount: paymentRes?.order?.amount || Math.round(totalAmount * 100),
                        currency: paymentRes?.order?.currency || "INR",
                        name: "Medical Store",
                        description: "Order Payment",
                        order_id: paymentRes?.order?.id,
                        handler: async function (response) {
                            try {
                                await PaymentService.verifyPayment({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    addressId
                                });
                                toast.success("Online Payment Successful! Order Placed 🎉");
                                GetCart();
                                router.push("/dashboard/orders");
                            } catch (err) {
                                console.error("Verification error:", err);
                                toast.error("Payment verification failed");
                            }
                        },
                        modal: {
                            ondismiss: function () {
                                toast.error("Razorpay payment cancelled");
                            }
                        },
                        prefill: { name: "", email: "", contact: "" },
                        theme: { color: "#3b82f6" }
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } catch (err) {
                    console.error("Razorpay payment error:", err);
                    toast.error(err.response?.data?.message || "Failed to initiate online payment");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const medicines = cartItems?.medicines || [];
    const selectedAddressObj = addresses.find(a => a._id === selectedAddressId);

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#020617", color: "#ffffff", pt: 14, pb: 12 }}>
            <Container maxWidth="lg">

                {/* Interactive Step Wizard */}
                <Box sx={{ mb: 6, display: "flex", justifyContent: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 3 }, backgroundColor: "rgba(15, 23, 42, 0.6)", p: 1.5, px: 3, borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.08)", backdropFilter: "blur(16px)" }}>
                        
                        {/* Step 1 Tab */}
                        <Box
                            onClick={() => setStep("cart")}
                            sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", opacity: step === "cart" ? 1 : 0.6, transition: "all 0.2s" }}
                        >
                            <Box sx={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: step === "cart" ? "#3b82f6" : "rgba(255,255,255,0.1)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", boxShadow: step === "cart" ? "0 0 12px rgba(59, 130, 246, 0.5)" : "none" }}>
                                1
                            </Box>
                            <Typography sx={{ fontWeight: step === "cart" ? 700 : 500, fontSize: { xs: "0.85rem", sm: "0.95rem" }, color: step === "cart" ? "#60a5fa" : "#94a3b8" }}>
                                Shopping Cart
                            </Typography>
                        </Box>

                        <Box sx={{ width: { xs: 20, sm: 40 }, height: 2, backgroundColor: step === "address" || step === "payment" ? "#3b82f6" : "rgba(255, 255, 255, 0.1)" }} />

                        {/* Step 2 Tab */}
                        <Box
                            onClick={() => { if (medicines.length > 0) setStep("address"); }}
                            sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: medicines.length > 0 ? "pointer" : "not-allowed", opacity: step === "address" ? 1 : 0.6, transition: "all 0.2s" }}
                        >
                            <Box sx={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: step === "address" ? "#3b82f6" : "rgba(255,255,255,0.1)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", boxShadow: step === "address" ? "0 0 12px rgba(59, 130, 246, 0.5)" : "none" }}>
                                2
                            </Box>
                            <Typography sx={{ fontWeight: step === "address" ? 700 : 500, fontSize: { xs: "0.85rem", sm: "0.95rem" }, color: step === "address" ? "#60a5fa" : "#94a3b8" }}>
                                Delivery Address
                            </Typography>
                        </Box>

                        <Box sx={{ width: { xs: 20, sm: 40 }, height: 2, backgroundColor: step === "payment" ? "#3b82f6" : "rgba(255, 255, 255, 0.1)" }} />

                        {/* Step 3 Tab */}
                        <Box
                            onClick={() => { if (medicines.length > 0 && selectedAddressId) setStep("payment"); }}
                            sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: medicines.length > 0 && selectedAddressId ? "pointer" : "not-allowed", opacity: step === "payment" ? 1 : 0.6, transition: "all 0.2s" }}
                        >
                            <Box sx={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: step === "payment" ? "#3b82f6" : "rgba(255,255,255,0.1)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", boxShadow: step === "payment" ? "0 0 12px rgba(59, 130, 246, 0.5)" : "none" }}>
                                3
                            </Box>
                            <Typography sx={{ fontWeight: step === "payment" ? 700 : 500, fontSize: { xs: "0.85rem", sm: "0.95rem" }, color: step === "payment" ? "#60a5fa" : "#94a3b8" }}>
                                Payment Method
                            </Typography>
                        </Box>

                    </Box>
                </Box>

                {/* STEP 1: CART ITEMS */}
                {step === "cart" && (
                    medicines.length === 0 ? (
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", py: 12, px: 4, borderRadius: "24px", border: "1px dashed rgba(255, 255, 255, 0.12)", backgroundColor: "rgba(15, 23, 42, 0.3)" }}>
                            <CleanHands style={{ fontSize: 72, color: "#64748b", marginBottom: 16 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "#ffffff" }}>
                                Your cart is empty
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mb: 4, maxWidth: "380px" }}>
                                Explore our medical catalog to add medicines and healthcare products.
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
                                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                                    "&:hover": { background: "linear-gradient(to right, #2563eb, #0891b2)" }
                                }}
                            >
                                Browse Medicines
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2.2fr 1fr" }, gap: 4 }}>
                            {/* Medicine Cards List */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <ShoppingCart className="text-blue-400" size={24} /> Your Cart Items ({medicines.length})
                                </Typography>

                                {medicines.map((item) => {
                                    const med = item.medicineId || {};
                                    const isUpdating = updatingIds[med._id];
                                    const unitPrice = med.sellingPrice || med.price || item.price || 0;
                                    const unitMrp = med.mrp || 0;
                                    const itemTotal = item.total || (unitPrice * item.quantity);
                                    const discountPercent = unitMrp > unitPrice ? Math.round(((unitMrp - unitPrice) / unitMrp) * 100) : 0;

                                    return (
                                        <Card
                                            key={item._id}
                                            sx={{
                                                borderRadius: "20px",
                                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                                backgroundColor: "rgba(15, 23, 42, 0.5)",
                                                backdropFilter: "blur(12px)",
                                                color: "#ffffff",
                                                p: 2.5,
                                                opacity: isUpdating ? 0.7 : 1,
                                                transition: "all 0.2s ease",
                                                "&:hover": { borderColor: "rgba(59, 130, 246, 0.3)" }
                                            }}
                                        >
                                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: 3 }}>
                                                {/* Medicine Thumbnail */}
                                                <Box sx={{ width: 80, height: 80, borderRadius: "14px", backgroundColor: "rgba(30, 41, 59, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                                    {med.image ? (
                                                        <img
                                                            src={med.image}
                                                            alt={med.medicineName}
                                                            onError={(e) => { e.target.onerror = null; e.target.src = "/images/no-image.png"; }}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        />
                                                    ) : (
                                                        <Pill className="text-blue-400" size={32} />
                                                    )}
                                                </Box>

                                                {/* Medicine Info */}
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#ffffff" }}>
                                                            {med.medicineName || "Unknown Medicine"}
                                                        </Typography>
                                                        {med.dosageForm && (
                                                            <Chip label={med.dosageForm} size="small" sx={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.3)", fontWeight: 700, height: "22px", fontSize: "0.72rem" }} />
                                                        )}
                                                        {med.strength && (
                                                            <Chip label={med.strength} size="small" sx={{ backgroundColor: "rgba(74, 222, 128, 0.15)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.3)", fontWeight: 700, height: "22px", fontSize: "0.72rem" }} />
                                                        )}
                                                    </Box>

                                                    {med.genericName && (
                                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 0.5, fontSize: "0.85rem" }}>
                                                            {med.genericName}
                                                        </Typography>
                                                    )}

                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
                                                        <Typography sx={{ fontWeight: 800, color: "#4ade80", fontSize: "1.1rem" }}>
                                                            ₹{unitPrice}
                                                        </Typography>
                                                        {unitMrp > unitPrice && (
                                                            <>
                                                                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.4)", textDecoration: "line-through", fontSize: "0.8rem" }}>
                                                                    MRP: ₹{unitMrp}
                                                                </Typography>
                                                                <span style={{ fontSize: "10px", padding: "1px 6px", backgroundColor: "rgba(74, 222, 128, 0.15)", color: "#4ade80", borderRadius: "4px", fontWeight: 800 }}>
                                                                    {discountPercent}% OFF
                                                                </span>
                                                            </>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Quantity Controls & Total Price */}
                                                <Box sx={{ display: "flex", flexDirection: { xs: "row", sm: "column" }, alignItems: { xs: "center", sm: "flex-end" }, justifyContent: "space-between", width: { xs: "100%", sm: "auto" }, gap: 2 }}>
                                                    <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                                                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>Subtotal</Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 900, color: "#3b82f6" }}>
                                                            ₹{itemTotal}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.1)", p: 0.5 }}>
                                                            <IconButton onClick={() => handleQuantityChange(med._id, item.quantity - 1)} disabled={item.quantity <= 1} size="small" sx={{ color: "#ffffff" }}>
                                                                <Minus size={14} />
                                                            </IconButton>
                                                            <Typography sx={{ mx: 1.5, fontWeight: 700, minWidth: "16px", textAlign: "center" }}>
                                                                {item.quantity}
                                                            </Typography>
                                                            <IconButton onClick={() => handleQuantityChange(med._id, item.quantity + 1)} size="small" sx={{ color: "#ffffff" }}>
                                                                <Plus size={14} />
                                                            </IconButton>
                                                        </Box>

                                                        <Tooltip title="Remove Item">
                                                            <IconButton onClick={() => handleRemoveItem(med._id)} color="error" sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "10px", p: 1, "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.2)" } }}>
                                                                <Trash2 size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>

                            {/* Summary Sidebar */}
                            <Box>
                                <Card sx={{ borderRadius: "24px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(20px)", color: "#ffffff", p: 3, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)" }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                                        Order Summary
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>Subtotal</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{totalAmount}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>Delivery Fee</Typography>
                                            <Typography variant="body2" sx={{ color: "#4ade80", fontWeight: 700 }}>FREE</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.08)" }} />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Amount</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: "#3b82f6" }}>₹{totalAmount}</Typography>
                                        </Box>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        endIcon={<ArrowRight size={18} />}
                                        onClick={() => setStep("address")}
                                        sx={{
                                            mt: 4,
                                            background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                            textTransform: "none",
                                            fontWeight: 750,
                                            py: 1.75,
                                            borderRadius: "14px",
                                            fontSize: "1rem",
                                            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                                            "&:hover": { background: "linear-gradient(to right, #2563eb, #22c55e)" }
                                        }}
                                    >
                                        Proceed to Delivery Address
                                    </Button>
                                </Card>
                            </Box>
                        </Box>
                    )
                )}

                {/* STEP 2: ADDRESS SELECTION */}
                {step === "address" && (
                    <Box sx={{ maxWidth: "720px", mx: "auto" }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "#ffffff" }}>
                            Select Delivery Address
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.55)", mb: 4 }}>
                            Choose a saved delivery address or enter a new shipping destination.
                        </Typography>

                        {!showAddAddressForm && addresses.length > 0 ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                {addresses.map((addr) => {
                                    const isSelected = selectedAddressId === addr._id;
                                    return (
                                        <Card
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            sx={{
                                                p: 2.5,
                                                borderRadius: "16px",
                                                border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                                                backgroundColor: isSelected ? "rgba(59, 130, 246, 0.08)" : "rgba(15, 23, 42, 0.5)",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                                <MapPin size={20} className={isSelected ? "text-blue-400" : "text-slate-400"} style={{ marginTop: "2px" }} />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1rem" }}>
                                                        {addr.addressLine1}
                                                    </Typography>
                                                    {addr.addressLine2 && (
                                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 0.5 }}>
                                                            {addr.addressLine2}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.45)", mt: 0.5 }}>
                                                        {addr.city}, {addr.state} - {addr.pincode}
                                                    </Typography>
                                                </Box>
                                                {isSelected && (
                                                    <Chip label="Selected" size="small" sx={{ backgroundColor: "#3b82f6", color: "#ffffff", fontWeight: 700, height: "24px" }} />
                                                )}
                                            </Box>
                                        </Card>
                                    );
                                })}

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => setShowAddAddressForm(true)}
                                    startIcon={<Plus size={18} />}
                                    sx={{
                                        py: 1.5,
                                        borderColor: "rgba(255, 255, 255, 0.15)",
                                        color: "rgba(255, 255, 255, 0.8)",
                                        borderRadius: "14px",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        "&:hover": { borderColor: "#3b82f6", color: "#3b82f6" }
                                    }}
                                >
                                    Add New Delivery Address
                                </Button>
                            </Box>
                        ) : (
                            <Card sx={{ p: 3, borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: "#ffffff" }}>
                                    Enter Shipping Details
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    <TextField
                                        label="Address Line 1 *"
                                        variant="outlined"
                                        fullWidth
                                        value={addressLine1}
                                        onChange={(e) => setAddressLine1(e.target.value)}
                                        InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                        inputProps={{ style: { color: "#ffffff" } }}
                                        sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "#3b82f6" } } }}
                                    />
                                    <TextField
                                        label="Address Line 2 (Optional)"
                                        variant="outlined"
                                        fullWidth
                                        value={addressLine2}
                                        onChange={(e) => setAddressLine2(e.target.value)}
                                        InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                        inputProps={{ style: { color: "#ffffff" } }}
                                        sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "#3b82f6" } } }}
                                    />
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                        <TextField
                                            label="City *"
                                            variant="outlined"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                            inputProps={{ style: { color: "#ffffff" } }}
                                            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "#3b82f6" } } }}
                                        />
                                        <TextField
                                            label="State *"
                                            variant="outlined"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                            inputProps={{ style: { color: "#ffffff" } }}
                                            sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "#3b82f6" } } }}
                                        />
                                    </Box>
                                    <TextField
                                        label="Pincode (6 Digits) *"
                                        variant="outlined"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        InputLabelProps={{ style: { color: "rgba(255,255,255,0.4)" } }}
                                        inputProps={{ style: { color: "#ffffff" }, maxLength: 6 }}
                                        sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "#3b82f6" } } }}
                                    />

                                    {addresses.length > 0 && (
                                        <Button
                                            onClick={() => setShowAddAddressForm(false)}
                                            sx={{ color: "rgba(255,255,255,0.6)", textTransform: "none", alignSelf: "flex-start" }}
                                        >
                                            ← Use Saved Address Instead
                                        </Button>
                                    )}
                                </Box>
                            </Card>
                        )}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                            <Button
                                variant="outlined"
                                onClick={() => setStep("cart")}
                                startIcon={<ArrowLeft size={18} />}
                                sx={{ color: "rgba(255, 255, 255, 0.7)", borderColor: "rgba(255, 255, 255, 0.15)", borderRadius: "12px", textTransform: "none", fontWeight: 600 }}
                            >
                                Back to Cart
                            </Button>
                            <Button
                                variant="contained"
                                endIcon={<ArrowRight size={18} />}
                                onClick={() => {
                                    if (showAddAddressForm) {
                                        if (!addressLine1 || !city || !state || !pincode) {
                                            toast.error("Please fill all required address fields");
                                            return;
                                        }
                                    } else if (!selectedAddressId) {
                                        toast.error("Please select a delivery address");
                                        return;
                                    }
                                    setStep("payment");
                                }}
                                sx={{ background: "linear-gradient(to right, #3b82f6, #4ade80)", borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 3.5, py: 1.25 }}
                            >
                                Next: Payment Method
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* STEP 3: PAYMENT METHOD */}
                {step === "payment" && (
                    <Box sx={{ maxWidth: "720px", mx: "auto" }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "#ffffff" }}>
                            Select Payment Method
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.55)", mb: 4 }}>
                            Choose your preferred payment option to complete your purchase.
                        </Typography>

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3, mb: 4 }}>
                            {/* Cash on Delivery Card */}
                            <Card
                                onClick={() => setPaymentMethod("COD")}
                                sx={{
                                    p: 3,
                                    borderRadius: "20px",
                                    border: paymentMethod === "COD" ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                                    backgroundColor: paymentMethod === "COD" ? "rgba(59, 130, 246, 0.08)" : "rgba(15, 23, 42, 0.5)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                    <Banknote size={26} className={paymentMethod === "COD" ? "text-blue-400" : "text-slate-400"} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#ffffff" }}>
                                            Cash on Delivery
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 0.5, fontSize: "0.85rem" }}>
                                            Pay in cash upon delivery of your order.
                                        </Typography>
                                    </Box>
                                    {paymentMethod === "COD" && <Check size={18} className="text-blue-400" />}
                                </Box>
                            </Card>

                            {/* Online Payment Card */}
                            <Card
                                onClick={() => setPaymentMethod("Online")}
                                sx={{
                                    p: 3,
                                    borderRadius: "20px",
                                    border: paymentMethod === "Online" ? "2px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                                    backgroundColor: paymentMethod === "Online" ? "rgba(59, 130, 246, 0.08)" : "rgba(15, 23, 42, 0.5)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                    <CreditCard size={26} className={paymentMethod === "Online" ? "text-emerald-400" : "text-slate-400"} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#ffffff" }}>
                                            Online Payment
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 0.5, fontSize: "0.85rem" }}>
                                            Pay via Razorpay (Cards, UPI, NetBanking).
                                        </Typography>
                                    </Box>
                                    {paymentMethod === "Online" && <Check size={18} className="text-blue-400" />}
                                </Box>
                            </Card>
                        </Box>

                        {/* Order Summary & Confirmation Box */}
                        <Card sx={{ p: 3, borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(15, 23, 42, 0.6)", mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff", mb: 2 }}>
                                Order Final Review
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>Selected Address:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#ffffff", textAlign: "right" }}>
                                        {selectedAddressObj ? `${selectedAddressObj.addressLine1}, ${selectedAddressObj.city}` : "New Shipping Address"}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>Selected Payment:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: paymentMethod === "Online" ? "#4ade80" : "#60a5fa" }}>
                                        {paymentMethod === "Online" ? "Online (Razorpay)" : "Cash on Delivery (COD)"}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.08)" }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Payable:</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#3b82f6" }}>₹{totalAmount}</Typography>
                                </Box>
                            </Box>
                        </Card>

                        {/* Navigation & Submit Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                                variant="outlined"
                                onClick={() => setStep("address")}
                                startIcon={<ArrowLeft size={18} />}
                                sx={{ color: "rgba(255, 255, 255, 0.7)", borderColor: "rgba(255, 255, 255, 0.15)", borderRadius: "12px", textTransform: "none", fontWeight: 600 }}
                            >
                                Back to Address
                            </Button>
                            <Button
                                variant="contained"
                                disabled={loading}
                                onClick={handlePlaceOrder}
                                sx={{
                                    background: "linear-gradient(to right, #3b82f6, #10b981)",
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    fontWeight: 800,
                                    fontSize: "1.05rem",
                                    px: 4,
                                    py: 1.5,
                                    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
                                    "&:hover": { background: "linear-gradient(to right, #2563eb, #059669)" }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                                ) : (
                                    paymentMethod === "Online" ? "Pay via Razorpay" : "Confirm & Place Order"
                                )}
                            </Button>
                        </Box>
                    </Box>
                )}

            </Container>
        </Box>
    )
}

export default page