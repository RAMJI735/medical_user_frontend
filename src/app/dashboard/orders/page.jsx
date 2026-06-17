"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OrderService } from "../../../../services/orderService/orderService";
import { useAuth } from "../../../../services/authService/AuthContext";
import { toast } from "react-hot-toast";
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Paper
} from "@mui/material";
import {
    ShoppingBag,
    Calendar,
    ArrowLeft,
    Pill,
    MapPin,
    CreditCard,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    FileText
} from "lucide-react";

export default function OrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Details Modal state
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await OrderService.getOrders();
            setOrders(data || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to load your orders history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/dashboard/login");
            } else {
                fetchOrders();
            }
        }
    }, [user, authLoading]);

    const handleViewDetails = async (orderId) => {
        setOpenDetails(true);
        setModalLoading(true);
        try {
            const detailedOrder = await OrderService.getOrderById(orderId);
            setSelectedOrder(detailedOrder);
        } catch (error) {
            console.error("Failed to fetch order details:", error);
            toast.error("Failed to load order details.");
            setOpenDetails(false);
        } finally {
            setModalLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        setCancellingId(orderId);
        try {
            await OrderService.cancelOrder(orderId);
            toast.success("Order cancelled successfully");
            
            // Refresh details if open
            if (selectedOrder && selectedOrder._id === orderId) {
                const detailedOrder = await OrderService.getOrderById(orderId);
                setSelectedOrder(detailedOrder);
            }
            
            // Refresh list
            const updatedOrders = await OrderService.getOrders();
            setOrders(updatedOrders || []);
        } catch (error) {
            console.error("Failed to cancel order:", error);
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "New Orders":
                return {
                    label: "New",
                    color: "#3b82f6",
                    bgColor: "rgba(59, 130, 246, 0.12)",
                    icon: <Clock size={14} className="mr-1" />
                };
            case "Processing Orders":
                return {
                    label: "Processing",
                    color: "#f59e0b",
                    bgColor: "rgba(245, 158, 11, 0.12)",
                    icon: <Clock size={14} className="mr-1" />
                };
            case "Shipped Orders":
                return {
                    label: "Shipped",
                    color: "#06b6d4",
                    bgColor: "rgba(6, 182, 212, 0.12)",
                    icon: <Truck size={14} className="mr-1" />
                };
            case "Delivered Orders":
                return {
                    label: "Delivered",
                    color: "#10b981",
                    bgColor: "rgba(16, 185, 129, 0.12)",
                    icon: <CheckCircle2 size={14} className="mr-1" />
                };
            case "Cancelled Orders":
                return {
                    label: "Cancelled",
                    color: "#ef4444",
                    bgColor: "rgba(239, 68, 68, 0.12)",
                    icon: <XCircle size={14} className="mr-1" />
                };
            default:
                return {
                    label: status,
                    color: "#94a3b8",
                    bgColor: "rgba(148, 163, 184, 0.12)",
                    icon: <Clock size={14} className="mr-1" />
                };
        }
    };

    if (authLoading || (loading && orders.length === 0)) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#020617" }}>
                <CircularProgress sx={{ color: "#3b82f6" }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#020617", color: "#ffffff", pt: 16, pb: 10 }}>
            <Container maxWidth="lg">
                {/* Navigation Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        onClick={() => router.push("/dashboard/medicine")}
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
                    My Orders
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.55)", mb: 5 }}>
                    Track status, check prescriptions, and review your previous formulations.
                </Typography>

                {orders.length === 0 ? (
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
                        <ShoppingBag size={64} className="text-slate-500 mb-6 opacity-80" />
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            No orders placed yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.45)", mb: 4, maxWidth: "400px" }}>
                            Your medical orders ledger is empty. Select your formulations and check out to place an order.
                        </Typography>
                        <Button
                            component={Link}
                            href="/dashboard/medicine"
                            variant="contained"
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
                            Explore Medicines
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {orders.map((order) => {
                            const statusStyle = getStatusStyle(order.status);
                            const itemsCount = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                            const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            });

                            return (
                                <Grid item xs={12} key={order._id}>
                                    <Card
                                        sx={{
                                            borderRadius: "20px",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                            backgroundColor: "rgba(15, 23, 42, 0.35)",
                                            backdropFilter: "blur(12px)",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                borderColor: "rgba(59, 130, 246, 0.25)",
                                                transform: "translateY(-2px)"
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 2 }}>
                                                {/* Left details */}
                                                <Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>
                                                            Order #{order._id.slice(-6).toUpperCase()}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                color: statusStyle.color,
                                                                backgroundColor: statusStyle.bgColor,
                                                                px: 2,
                                                                py: 0.5,
                                                                borderRadius: "9999px",
                                                                fontSize: "12px",
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            {statusStyle.icon}
                                                            {statusStyle.label}
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 3, color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <Calendar size={14} />
                                                            <span>{orderDate}</span>
                                                        </Box>
                                                        <span>•</span>
                                                        <span>{itemsCount} {itemsCount === 1 ? "item" : "items"}</span>
                                                    </Box>
                                                </Box>

                                                {/* Right Pricing and Actions */}
                                                <Box sx={{ display: "flex", alignItems: "center", justifySelf: "flex-end", gap: { xs: 2.5, sm: 4 }, flexDirection: { xs: "row", sm: "row" }, justifyContent: { xs: "space-between", sm: "flex-end" } }}>
                                                    <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                                                        <Typography sx={{ fontWeight: 900, color: "#4ade80", fontSize: "1.2rem" }}>
                                                            ₹{order.totalAmount}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                                                            {order.paymentMethod} • {order.paymentStatus}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", gap: 1.5 }}>
                                                        <Button
                                                            onClick={() => handleViewDetails(order._id)}
                                                            variant="contained"
                                                            size="small"
                                                            sx={{
                                                                textTransform: "none",
                                                                fontWeight: 700,
                                                                borderRadius: "10px",
                                                                px: 2.5,
                                                                py: 1.25,
                                                                background: "linear-gradient(to right, #3b82f6, #0ea5e9)",
                                                                "&:hover": {
                                                                    background: "linear-gradient(to right, #2563eb, #0284c7)"
                                                                }
                                                            }}
                                                        >
                                                            View Details
                                                        </Button>
                                                        {order.status === "New Orders" && (
                                                            <Button
                                                                onClick={() => handleCancelOrder(order._id)}
                                                                disabled={cancellingId === order._id}
                                                                variant="outlined"
                                                                color="error"
                                                                size="small"
                                                                sx={{
                                                                    textTransform: "none",
                                                                    fontWeight: 600,
                                                                    borderRadius: "10px",
                                                                    borderColor: "rgba(239, 68, 68, 0.3)",
                                                                    "&:hover": {
                                                                        borderColor: "rgba(239, 68, 68, 0.6)",
                                                                        backgroundColor: "rgba(239, 68, 68, 0.05)"
                                                                    }
                                                                }}
                                                            >
                                                                {cancellingId === order._id ? "Cancelling..." : "Cancel"}
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>

            {/* Order Details Modal (calls getById inside) */}
            <Dialog
                open={openDetails}
                onClose={() => !modalLoading && setOpenDetails(false)}
                maxWidth="md"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        backgroundColor: "#0f172a !important",
                        color: "#ffffff !important",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "24px",
                        padding: { xs: 1.5, sm: 3 }
                    }
                }}
            >
                {modalLoading ? (
                    <Box sx={{ display: "flex", p: 10, alignItems: "center", justifyContent: "center" }}>
                        <CircularProgress sx={{ color: "#3b82f6" }} />
                    </Box>
                ) : selectedOrder ? (
                    <>
                        <DialogTitle sx={{ p: 2, pb: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1.5 }}>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 900, fontSize: "1.35rem" }}>
                                        Order Details
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                                        ID: {selectedOrder._id}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        color: getStatusStyle(selectedOrder.status).color,
                                        backgroundColor: getStatusStyle(selectedOrder.status).bgColor,
                                        px: 2.5,
                                        py: 0.75,
                                        borderRadius: "9999px",
                                        fontSize: "13px",
                                        fontWeight: 800
                                    }}
                                >
                                    {getStatusStyle(selectedOrder.status).icon}
                                    {getStatusStyle(selectedOrder.status).label}
                                </Box>
                            </Box>
                        </DialogTitle>
                        
                        <DialogContent sx={{ p: 2, mt: 1 }}>
                            <Grid container spacing={3.5}>
                                {/* Left side: Product lists */}
                                <Grid item xs={12} md={7}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                        <Pill size={16} className="text-blue-400" />
                                        <span>Prescribed Items</span>
                                    </Typography>
                                    
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxH: "320px", overflowY: "auto", pr: 1 }}>
                                        {selectedOrder.items.map((item, index) => {
                                            const med = item.medicineId || {};
                                            return (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        border: "1px solid rgba(255, 255, 255, 0.04)",
                                                        backgroundColor: "rgba(255,255,255,0.02)"
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                        <Box sx={{ width: 44, height: 44, borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                                                            {med.image ? (
                                                                <img
                                                                    src={med.image}
                                                                    alt={med.medicineName}
                                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                                />
                                                            ) : (
                                                                <Pill size={18} className="text-blue-400" />
                                                            )}
                                                        </Box>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>
                                                                {med.medicineName || "Unknown Medicine"}
                                                            </Typography>
                                                            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "11px" }}>
                                                                {med.genericName} {med.strength && `(${med.strength})`}
                                                            </Typography>
                                                            <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", mt: 0.5 }}>
                                                                Qty: {item.quantity} × ₹{item.price}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 800, color: "#4ade80", fontSize: "14px" }}>
                                                        ₹{item.price * item.quantity}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                    
                                    <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />
                                    
                                    {/* Order stats checkout breakdown */}
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 1 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>Subtotal</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{selectedOrder.totalAmount}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>Shipping</Typography>
                                            <Typography variant="body2" sx={{ color: "#4ade80", fontWeight: 600 }}>FREE</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>GST / Levies</Typography>
                                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.3)" }}>Included</Typography>
                                        </Box>
                                        <Divider sx={{ my: 0.5, borderColor: "rgba(255,255,255,0.05)" }} />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: "15px" }}>Grand Total</Typography>
                                            <Typography sx={{ fontWeight: 900, color: "#3b82f6", fontSize: "1.2rem" }}>₹{selectedOrder.totalAmount}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Right side: Shipping address details */}
                                <Grid item xs={12} md={5}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2.5,
                                            borderRadius: "18px",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                            backgroundColor: "rgba(255,255,255,0.01)",
                                            color: "#ffffff"
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1, textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)" }}>
                                            <MapPin size={12} />
                                            <span>Delivery Address</span>
                                        </Typography>
                                        
                                        {selectedOrder.addressId ? (
                                            <Box sx={{ fontSize: "13px", lineHeight: 1.6 }}>
                                                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{user?.name}</Typography>
                                                <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>{selectedOrder.addressId.addressLine1}</Typography>
                                                {selectedOrder.addressId.addressLine2 && (
                                                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>{selectedOrder.addressId.addressLine2}</Typography>
                                                )}
                                                <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                                                    {selectedOrder.addressId.city}, {selectedOrder.addressId.state} - {selectedOrder.addressId.pincode}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>No address record populated</Typography>
                                        )}
                                    </Paper>

                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2.5,
                                            mt: 2.5,
                                            borderRadius: "18px",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                            backgroundColor: "rgba(255,255,255,0.01)",
                                            color: "#ffffff"
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: "flex", alignItems: "center", gap: 1, textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)" }}>
                                            <CreditCard size={12} />
                                            <span>Billing & Prescriptions</span>
                                        </Typography>
                                        
                                        <Box sx={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: 1 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ color: "rgba(255,255,255,0.45)" }}>Payment:</span>
                                                <span style={{ fontWeight: 700 }}>{selectedOrder.paymentMethod}</span>
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ color: "rgba(255,255,255,0.45)" }}>Payment Status:</span>
                                                <span style={{ color: selectedOrder.paymentStatus === "Paid" ? "#4ade80" : "#f59e0b", fontWeight: 700 }}>
                                                    {selectedOrder.paymentStatus}
                                                </span>
                                            </Box>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ color: "rgba(255,255,255,0.45)" }}>Rx Prescribed:</span>
                                                <span>{selectedOrder.rxRequired ? "Required" : "Not Required"}</span>
                                            </Box>
                                            {selectedOrder.rxRequired && (
                                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <span style={{ color: "rgba(255,255,255,0.45)" }}>Rx Verification:</span>
                                                    <span style={{ color: selectedOrder.rxVerified ? "#4ade80" : "#f59e0b", fontWeight: 700 }}>
                                                        {selectedOrder.rxVerified ? "Verified" : "Pending Audit"}
                                                    </span>
                                                </Box>
                                            )}
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        
                        <DialogActions sx={{ p: 2, pt: 1, borderTop: "1px solid rgba(255,255,255,0.06)", mt: 2, gap: 1 }}>
                            {selectedOrder.status === "New Orders" && (
                                <Button
                                    onClick={() => handleCancelOrder(selectedOrder._id)}
                                    disabled={cancellingId === selectedOrder._id}
                                    variant="outlined"
                                    color="error"
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 650,
                                        borderRadius: "10px",
                                        borderColor: "rgba(239, 68, 68, 0.4)",
                                        "&:hover": {
                                            borderColor: "rgba(239, 68, 68, 0.7)",
                                            backgroundColor: "rgba(239, 68, 68, 0.05)"
                                        }
                                    }}
                                >
                                    {cancellingId === selectedOrder._id ? "Cancelling..." : "Cancel Order"}
                                </Button>
                            )}
                            <Button
                                onClick={() => setOpenDetails(false)}
                                variant="contained"
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    px: 3.5,
                                    borderRadius: "10px",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    color: "#ffffff",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.15)"
                                    }
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                ) : (
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", py: 4, textAlign: "center" }}>
                        Failed to resolve order data.
                    </Typography>
                )}
            </Dialog>
        </Box>
    );
}
