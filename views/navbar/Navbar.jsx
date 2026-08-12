"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Menu as MenuIcon, 
    X as XIcon, 
    ChevronDown, 
    ShoppingCart, 
    Pill, 
    User, 
    LogOut,
    Sparkles 
} from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Badge from "@mui/material/Badge";
import navbarData from "../../data/navbar-list.json";
import { useAuth } from "../../services/authService/AuthContext";
import { CartService } from "../../services/cartService/cartService";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // MUI Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch live cart summary count if user logged in
    useEffect(() => {
        if (!mounted || !user) {
            setCartCount(0);
            return;
        }
        async function fetchCartCount() {
            try {
                const data = await CartService.getCartSummary();
                const count = (data || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
                setCartCount(count);
            } catch (err) {
                console.error("Cart badge fetch error:", err);
            }
        }
        fetchCartCount();
        
        // Listen for custom cart-updated events if fired anywhere
        const handleCartUpdate = () => fetchCartCount();
        window.addEventListener("cart-updated", handleCartUpdate);
        return () => window.removeEventListener("cart-updated", handleCartUpdate);
    }, [user, mounted, pathname]);

    if (!mounted) {
        return null;
    }

    // Hide navbar on auth pages if needed
    if (pathname === "/dashboard/login" || pathname === "/dashboard/signup") {
        return null;
    }

    const handleOpenMenu = (event, menuLabel) => {
        setAnchorEl(event.currentTarget);
        setActiveMenu(menuLabel);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setActiveMenu(null);
    };

    const toggleSubmenu = (label) => {
        setOpenSubmenu(openSubmenu === label ? null : label);
    };

    return (
        <Box
            component="header"
            sx={{
                position: "fixed",
                top: { xs: 12, md: 18 },
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                width: "max-content",
                maxWidth: "96vw",
            }}
        >
            {/* Desktop / Tablet Navigation Bar */}
            <Box
                component="nav"
                sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    gap: { md: "1.5rem", lg: "2.2rem" },
                    borderRadius: "9999px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    backgroundColor: "rgba(15, 23, 42, 0.75)",
                    color: "#ffffff",
                    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(59, 130, 246, 0.1)",
                    backdropFilter: "blur(20px)",
                    px: "1.75rem",
                    py: "0.625rem",
                    transition: "all 0.3s ease",
                }}
            >
                {/* Brand Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #3b82f6, #10b981)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 12px rgba(59, 130, 246, 0.5)",
                        }}
                    >
                        <Pill size={18} style={{ color: "#ffffff" }} />
                    </Box>
                    <Box component="span" sx={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em", color: "#ffffff" }}>
                        Healthcare<span style={{ color: "#38bdf8" }}>Expert</span>
                    </Box>
                </Link>

                {/* Navigation Links */}
                <Box
                    component="ul"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.5rem",
                        fontSize: "14px",
                        fontWeight: 500,
                        listStyle: "none",
                        p: 0,
                        m: 0,
                    }}
                >
                    {navbarData.menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Box
                                component="li"
                                key={item.label}
                                sx={{
                                    position: "relative",
                                    cursor: "pointer",
                                }}
                            >
                                {item.submenu ? (
                                    <>
                                        <Box
                                            onClick={(e) => handleOpenMenu(e, item.label)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                color: activeMenu === item.label ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                                                transition: "color 0.2s ease",
                                                "&:hover": { color: "#ffffff" },
                                            }}
                                        >
                                            <span>{item.label}</span>
                                            <ChevronDown
                                                size={14}
                                                style={{
                                                    transition: "transform 0.3s ease",
                                                    transform: activeMenu === item.label ? "rotate(180deg)" : "none",
                                                }}
                                            />
                                        </Box>

                                        <Menu
                                            anchorEl={anchorEl}
                                            open={activeMenu === item.label}
                                            onClose={handleCloseMenu}
                                            slotProps={{
                                                paper: {
                                                    sx: {
                                                        backgroundColor: "rgba(15, 23, 42, 0.95) !important",
                                                        backdropFilter: "blur(20px)",
                                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                                        borderRadius: "16px",
                                                        color: "#ffffff",
                                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                                                        p: "0.35rem",
                                                        mt: "0.75rem",
                                                        minWidth: "220px",
                                                    },
                                                },
                                            }}
                                            transformOrigin={{ vertical: "top", horizontal: "left" }}
                                            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                        >
                                            {item.submenu.map((sub) => (
                                                <MenuItem
                                                    key={sub.label}
                                                    onClick={handleCloseMenu}
                                                    component={Link}
                                                    href={sub.href}
                                                    sx={{
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        color: "rgba(255, 255, 255, 0.8)",
                                                        py: 1,
                                                        px: 2,
                                                        "&:hover": {
                                                            backgroundColor: "rgba(59, 130, 246, 0.15)",
                                                            color: "#38bdf8",
                                                        },
                                                    }}
                                                >
                                                    {sub.label}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        style={{
                                            color: isActive ? "#38bdf8" : "rgba(255, 255, 255, 0.8)",
                                            fontWeight: isActive ? 600 : 500,
                                            transition: "color 0.2s ease",
                                        }}
                                        className="hover:text-white"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </Box>
                        );
                    })}
                </Box>

                {/* Right Action Icons & User Control */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {/* Cart Quick Button */}
                    <IconButton
                        component={Link}
                        href="/dashboard/cart"
                        sx={{
                            color: "#ffffff",
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            p: "0.5rem",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                backgroundColor: "rgba(59, 130, 246, 0.2)",
                                borderColor: "rgba(59, 130, 246, 0.4)",
                            },
                        }}
                    >
                        <Badge badgeContent={cartCount} color="primary" sx={{ "& .MuiBadge-badge": { backgroundColor: "#3b82f6", color: "#fff", fontWeight: 700 } }}>
                            <ShoppingCart size={18} />
                        </Badge>
                    </IconButton>

                    {loading ? (
                        <Skeleton
                            variant="rectangular"
                            width={130}
                            height={36}
                            animation="wave"
                            sx={{ borderRadius: "9999px", bgcolor: "rgba(255, 255, 255, 0.08)" }}
                        />
                    ) : user ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Button
                                component={Link}
                                href="/dashboard/orders"
                                size="small"
                                sx={{
                                    textTransform: "none",
                                    color: "#ffffff",
                                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                                    border: "1px solid rgba(255, 255, 255, 0.12)",
                                    borderRadius: "9999px",
                                    px: 2,
                                    py: 0.6,
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.12)" },
                                }}
                            >
                                Orders
                            </Button>
                            <Button
                                onClick={logout}
                                size="small"
                                variant="outlined"
                                startIcon={<LogOut size={14} />}
                                sx={{
                                    textTransform: "none",
                                    borderColor: "rgba(239, 68, 68, 0.4)",
                                    color: "#f87171",
                                    borderRadius: "9999px",
                                    px: 2,
                                    py: 0.6,
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    "&:hover": {
                                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                                        borderColor: "#ef4444",
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            component={Link}
                            href="/dashboard/login"
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                background: "linear-gradient(to right, #3b82f6, #10b981)",
                                borderRadius: "9999px",
                                px: 2.5,
                                py: 0.6,
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: "#ffffff",
                                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                                "&:hover": {
                                    background: "linear-gradient(to right, #2563eb, #059669)",
                                },
                            }}
                        >
                            Login / Sign Up
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Mobile Header Bar & Drawer */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                {!isOpen ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "92vw",
                            borderRadius: "9999px",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            backgroundColor: "rgba(15, 23, 42, 0.85)",
                            px: 2.5,
                            py: 1,
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)",
                            color: "#ffffff",
                        }}
                    >
                        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Pill size={20} className="text-blue-400" />
                            <Box component="span" sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#ffffff" }}>
                                Healthcare<span style={{ color: "#38bdf8" }}>Expert</span>
                            </Box>
                        </Link>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                                component={Link}
                                href="/dashboard/cart"
                                sx={{ color: "#ffffff", p: 0.5 }}
                            >
                                <Badge badgeContent={cartCount} color="primary" sx={{ "& .MuiBadge-badge": { backgroundColor: "#3b82f6", fontSize: 10, height: 16, minWidth: 16 } }}>
                                    <ShoppingCart size={18} />
                                </Badge>
                            </IconButton>

                            <Button
                                onClick={() => setIsOpen(true)}
                                sx={{
                                    minWidth: 0,
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(255, 255, 255, 0.12)",
                                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                                    color: "#ffffff",
                                    p: 0,
                                }}
                                aria-label="Open menu"
                            >
                                <MenuIcon size={18} />
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            width: "92vw",
                            borderRadius: "24px",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            p: 2.5,
                            backdropFilter: "blur(24px)",
                            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
                            color: "#ffffff",
                            animation: "fadeIn 0.2s ease-out",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Link href="/" onClick={() => setIsOpen(false)} style={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Pill size={20} className="text-blue-400" />
                                <Box component="span" sx={{ fontWeight: 800, fontSize: "1rem", color: "#ffffff" }}>
                                    Healthcare<span style={{ color: "#38bdf8" }}>Expert</span>
                                </Box>
                            </Link>

                            <Button
                                onClick={() => setIsOpen(false)}
                                sx={{
                                    minWidth: 0,
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    color: "#ffffff",
                                    p: 0,
                                }}
                                aria-label="Close menu"
                            >
                                <XIcon size={18} />
                            </Button>
                        </Box>

                        <List sx={{ width: "100%", p: 0, mb: 2 }}>
                            {navbarData.menuItems.map((item) => (
                                <ListItem
                                    key={item.label}
                                    disablePadding
                                    sx={{
                                        flexDirection: "column",
                                        alignItems: "stretch",
                                        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                                    }}
                                >
                                    {item.submenu ? (
                                        <Box sx={{ width: "100%" }}>
                                            <ListItemButton
                                                onClick={() => toggleSubmenu(item.label)}
                                                sx={{
                                                    justifyContent: "space-between",
                                                    color: "rgba(255, 255, 255, 0.85)",
                                                    py: 1.25,
                                                    px: 1,
                                                    borderRadius: "8px",
                                                }}
                                            >
                                                <ListItemText primary={item.label} slotProps={{ primary: { fontSize: "15px", fontWeight: 500 } }} />
                                                <ChevronDown
                                                    size={16}
                                                    style={{
                                                        transition: "transform 0.2s ease",
                                                        transform: openSubmenu === item.label ? "rotate(180deg)" : "none",
                                                    }}
                                                />
                                            </ListItemButton>
                                            <Collapse in={openSubmenu === item.label} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding sx={{ pl: 2, borderLeft: "1px solid rgba(59, 130, 246, 0.3)", my: 0.5 }}>
                                                    {item.submenu.map((sub) => (
                                                        <ListItem key={sub.label} disablePadding>
                                                            <ListItemButton
                                                                component={Link}
                                                                href={sub.href}
                                                                onClick={() => setIsOpen(false)}
                                                                sx={{ py: 1, px: 1.5, borderRadius: "6px" }}
                                                            >
                                                                <ListItemText primary={sub.label} slotProps={{ primary: { fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" } }} />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        </Box>
                                    ) : (
                                        <ListItemButton
                                            component={Link}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            sx={{ py: 1.25, px: 1, borderRadius: "8px" }}
                                        >
                                            <ListItemText primary={item.label} slotProps={{ primary: { fontSize: "15px", fontWeight: 500, color: "rgba(255, 255, 255, 0.85)" } }} />
                                        </ListItemButton>
                                    )}
                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                            {user ? (
                                <>
                                    <Box sx={{ textAlign: "center", color: "#38bdf8", fontSize: "14px", fontWeight: 600 }}>
                                        Hi, {user.name || user.email}
                                    </Box>
                                    <Button
                                        component={Link}
                                        href="/dashboard/orders"
                                        onClick={() => setIsOpen(false)}
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            borderRadius: "9999px",
                                            color: "#ffffff",
                                            borderColor: "rgba(255, 255, 255, 0.2)",
                                            textTransform: "none",
                                        }}
                                    >
                                        My Orders
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        sx={{ borderRadius: "9999px", textTransform: "none" }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    component={Link}
                                    href="/dashboard/login"
                                    onClick={() => setIsOpen(false)}
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        borderRadius: "9999px",
                                        background: "linear-gradient(to right, #3b82f6, #10b981)",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        py: 1.2,
                                    }}
                                >
                                    Login / Sign Up
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}