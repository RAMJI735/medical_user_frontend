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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip
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
    FileText,
    Trash2,
    ChevronRight,
    Package
} from "lucide-react";

export default function OrdersPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    
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
            
            if (selectedOrder && selectedOrder._id === orderId) {
                const detailedOrder = await OrderService.getOrderById(orderId);
                setSelectedOrder(detailedOrder);
            }
            
            const updatedOrders = await OrderService.getOrders();
            setOrders(updatedOrders || []);
        } catch (error) {
            console.error("Failed to cancel order:", error);
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancellingId(null);
        }
    };

    const filteredOrders = orders.filter(ord => {
        if (filterStatus === "ALL") return true;
        const st = (ord.status || ord.orderStatus || "").toUpperCase();
        return st === filterStatus;
    });

    const getStatusChip = (status) => {
        const st = (status || "PENDING").toUpperCase();
        if (st === "DELIVERED") {
            return <Chip icon={<CheckCircle2 size={14} />} label="Delivered" size="small" sx={{ backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid #10b981", fontWeight: 700 }} />;
        }
        if (st === "CANCELLED" || st === "CANCELED") {
            return <Chip icon={<XCircle size={14} />} label="Cancelled" size="small" sx={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid #ef4444", fontWeight: 700 }} />;
        }
        if (st === "SHIPPED" || st === "PROCESSING") {
            return <Chip icon={<Truck size={14} />} label={st} size="small" sx={{ backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#38bdf8", border: "1px solid #3b82f6", fontWeight: 700 }} />;
        }
        return <Chip icon={<Clock size={14} />} label="Pending" size="small" sx={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", border: "1px solid #f59e0b", fontWeight: 700 }} />;
    };

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#020617", color: "#ffffff", pt: { xs: 12, md: 14 }, pb: 10 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                            My Orders History
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 0.5 }}>
                            Track active prescriptions, past deliveries, and order receipts.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href="/dashboard/medicine"
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ color: "#38bdf8", textTransform: "none", fontWeight: 600 }}
                    >
                        Return to Shop
                    </Button>
                </Box>

                {/* Status Filter Tabs */}
                <Box sx={{ display: "flex", gap: 1.5, mb: 4, overflowX: "auto", pb: 1 }}>
                    {[
                        { label: "All Orders", key: "ALL" },
                        { label: "Pending / Processing", key: "PENDING" },
                        { label: "Delivered", key: "DELIVERED" },
                        { label: "Cancelled", key: "CANCELLED" },
                    ].map((tab) => (
                        <Button
                            key={tab.key}
                            onClick={() => setFilterStatus(tab.key)}
                            variant={filterStatus === tab.key ? "contained" : "outlined"}
                            sx={{
                                borderRadius: "9999px",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                whiteSpace: "nowrap",
                                px: 2.5,
                                py: 0.6,
                                ...(filterStatus === tab.key ? {
                                    background: "linear-gradient(to right, #3b82f6, #10b981)",
                                    color: "#ffffff",
                                } : {
                                    borderColor: "rgba(255, 255, 255, 0.12)",
                                    color: "rgba(255, 255, 255, 0.7)",
                                })
                            }}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </Box>

                {/* Orders List */}
                {loading ? (
                    <Box sx={{ textAlign: "center", py: 12 }}>
                        <CircularProgress color="primary" />
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 2 }}>
                            Loading your orders history...
                        </Typography>
                    </Box>
                ) : filteredOrders.length === 0 ? (
                    <Box className="glass-panel" sx={{ p: 6, borderRadius: "24px", textAlign: "center" }}>
                        <Package size={48} style={{ color: "rgba(255, 255, 255, 0.3)", marginBottom: 16 }} />
                        <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700 }}>
                            No orders found
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 1, mb: 3 }}>
                            You haven't placed any orders matching this criteria yet.
                        </Typography>
                        <Button
                            component={Link}
                            href="/dashboard/medicine"
                            variant="contained"
                            sx={{ borderRadius: "9999px", px: 4, py: 1, background: "linear-gradient(to right, #3b82f6, #10b981)", textTransform: "none", fontWeight: 700 }}
                        >
                            Browse Medicines
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        {filteredOrders.map((ord) => {
                            const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
                            const items = ord.medicines || ord.items || [];

                            return (
                                <Box
                                    key={ord._id}
                                    className="glass-card"
                                    sx={{
                                        p: 3,
                                        borderRadius: "20px",
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        alignItems: { xs: "flex-start", md: "center" },
                                        justifyContent: "space-between",
                                        gap: 3,
                                    }}
                                >
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#ffffff" }}>
                                                Order #{ord._id.slice(-8).toUpperCase()}
                                            </Typography>
                                            {getStatusChip(ord.status || ord.orderStatus)}
                                            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.5)", display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <Calendar size={13} /> {dateStr}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>
                                            {items.length} item(s) • Total: <strong style={{ color: "#34d399" }}>₹{ord.totalAmount}</strong> ({ord.paymentMethod || "COD"})
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: { xs: "100%", md: "auto" }, justifyContent: { xs: "space-between", md: "flex-end" } }}>
                                        <Button
                                            onClick={() => handleViewDetails(ord._id)}
                                            variant="outlined"
                                            size="small"
                                            endIcon={<ChevronRight size={16} />}
                                            sx={{
                                                borderRadius: "9999px",
                                                borderColor: "rgba(56, 189, 248, 0.3)",
                                                color: "#38bdf8",
                                                textTransform: "none",
                                                px: 2.5,
                                                py: 0.8,
                                                fontWeight: 600,
                                            }}
                                        >
                                            View Details
                                        </Button>

                                        {((ord.status || ord.orderStatus || "").toUpperCase() === "PENDING") && (
                                            <Button
                                                onClick={() => handleCancelOrder(ord._id)}
                                                disabled={cancellingId === ord._id}
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                sx={{ borderRadius: "9999px", textTransform: "none", px: 2 }}
                                            >
                                                Cancel Order
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {/* Details Modal */}
                <Dialog
                    open={openDetails}
                    onClose={() => setOpenDetails(false)}
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
                    <DialogTitle sx={{ fontWeight: 800, fontSize: "1.25rem", color: "#ffffff" }}>
                        Order Breakdown & Invoice
                    </DialogTitle>
                    <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                        {modalLoading || !selectedOrder ? (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <CircularProgress color="primary" />
                            </Box>
                        ) : (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>Status:</span>
                                    {getStatusChip(selectedOrder.status || selectedOrder.orderStatus)}
                                </Box>

                                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#ffffff" }}>
                                    Itemized Prescription Medicines
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    {(selectedOrder.medicines || selectedOrder.items || []).map((item, idx) => {
                                        const med = item.medicineId || {};
                                        const price = med.sellingPrice || item.price || 0;
                                        return (
                                            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                                                <span>{med.medicineName || item.name || "Medicine"} x {item.quantity}</span>
                                                <strong style={{ color: "#34d399" }}>₹{price * item.quantity}</strong>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.1rem" }}>
                                    <span>Total Invoice Amount:</span>
                                    <span style={{ color: "#34d399" }}>₹{selectedOrder.totalAmount}</span>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setOpenDetails(false)} sx={{ color: "rgba(255, 255, 255, 0.7)", textTransform: "none" }}>
                            Close Window
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
