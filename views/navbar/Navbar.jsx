"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as XIcon, ChevronDown } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import navbarData from "../../data/navbar-list.json";
import { useAuth } from "../../services/authService/AuthContext";

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    // MUI Menu State
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

    const handleOpenMenu = (event, menuLabel) => {
        setAnchorEl(event.currentTarget);
        setActiveMenu(menuLabel);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setActiveMenu(null);
    };

    const toggleSubmenu = (label) => {
        if (openSubmenu === label) {
            setOpenSubmenu(null);
        } else {
            setOpenSubmenu(label);
        }
    };

    return (
        <Box
            component="header"
            sx={{
                position: "fixed",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 50,
                width: "max-content",
                maxWidth: "95vw",
            }}
        >
            {/* Desktop/Tablet Glassmorphic Navbar */}
            <Box
                component="nav"
                sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    gap: "2rem",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: "rgba(18, 18, 18, 0.4)",
                    color: "#ffffff",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(12px)",
                    paddingLeft: "2.5rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.75rem",
                    paddingBottom: "0.75rem",
                    transition: "all 0.3s ease",
                }}
            >
                {/* Navigation Items */}
                <Box
                    component="ul"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                        fontSize: "15px",
                        fontWeight: 500,
                        letterSpacing: "0.025em",
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                    }}
                >
                    {navbarData.menuItems.map((item) => (
                        <Box
                            component="li"
                            key={item.label}
                            sx={{
                                position: "relative",
                                cursor: "pointer",
                                userSelect: "none",
                                "& .underline": {
                                    position: "absolute",
                                    left: 0,
                                    bottom: "-5px",
                                    width: 0,
                                    height: "4px",
                                    borderRadius: "9999px",
                                    background: "linear-gradient(to right, #3b82f6, #22c55e)",
                                    transition: "width 0.3s ease",
                                },
                                "&:hover .underline": {
                                    width: "100%",
                                },
                            }}
                        >
                            {item.submenu ? (
                                <>
                                    {/* Parent Menu Item */}
                                    <Box
                                        onClick={(e) => handleOpenMenu(e, item.label)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            color: "rgba(255, 255, 255, 0.8)",
                                            transition: "color 0.2s ease",
                                            userSelect: "none",
                                            "&:hover": {
                                                color: "#ffffff",
                                            },
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

                                    {/* MUI Dropdown Menu */}
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={activeMenu === item.label}
                                        onClose={handleCloseMenu}
                                        slotProps={{
                                            paper: {
                                                sx: {
                                                    backgroundColor: "rgba(18, 18, 18, 0.95) !important",
                                                    backdropFilter: "blur(16px)",
                                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                                    borderRadius: "16px",
                                                    color: "#ffffff",
                                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                                                    padding: "0.25rem",
                                                    marginTop: "0.5rem",
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
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    color: "rgba(255, 255, 255, 0.8)",
                                                    padding: "0.625rem 1.25rem",
                                                    fontFamily: "inherit",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                        color: "#ffffff",
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
                                    className="text-white/80 transition-colors duration-200 hover:text-white select-none outline-none"
                                >
                                    {item.label}
                                </Link>
                            )}
                            {/* Sliding Underline Animation */}
                            <span className="underline"></span>
                        </Box>
                    ))}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {loading ? (
                        <Skeleton 
                            variant="rectangular" 
                            width={150} 
                            height={36} 
                            animation="wave"
                            sx={{ borderRadius: "9999px", bgcolor: "rgba(255, 255, 255, 0.08)" }} 
                        />
                    ) : user ? (
                        <>
                            <Box component="span" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", fontWeight: 500 }}>
                                Hi, {user.name}
                            </Box>
                            <Button
                                onClick={logout}
                                variant="outlined"
                                sx={{
                                    textTransform: "none",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    padding: "0.375rem 1.25rem",
                                    borderRadius: "9999px",
                                    fontSize: "0.95rem",
                                    fontWeight: 500,
                                    color: "#ffffff",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        borderColor: "rgba(255, 255, 255, 0.4)",
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : Array.isArray(navbarData.button) ? (
                        navbarData.button.map((btn, index) => (
                            <Button
                                key={btn.label}
                                component={Link}
                                href={btn.href}
                                variant={index === 0 ? "contained" : "outlined"}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "9999px",
                                    transition: "all 0.3s ease",
                                    order: index === 0 ? 2 : 1,
                                    ...(index === 0 ? {
                                        background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                        padding: "0.375rem 1.5rem",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        color: "#ffffff",
                                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                                        "&:hover": {
                                            background: "linear-gradient(to right, #2563eb, #22c55e)",
                                            boxShadow: "0 4px 20px rgba(34, 197, 94, 0.4)",
                                        },
                                    } : {
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        padding: "0.375rem 1.25rem",
                                        fontSize: "0.95rem",
                                        fontWeight: 500,
                                        color: "#ffffff",
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            borderColor: "rgba(255, 255, 255, 0.4)",
                                        },
                                    })
                                }}
                            >
                                {btn.label}
                            </Button>
                        ))
                    ) : (
                        <>
                            {navbarData.button && !Array.isArray(navbarData.button) && (
                                <Button
                                    component={Link}
                                    href={navbarData.button.href}
                                    variant="contained"
                                    sx={{
                                        textTransform: "none",
                                        background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                        padding: "0.375rem 1.5rem",
                                        borderRadius: "9999px",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        color: "#ffffff",
                                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: "linear-gradient(to right, #2563eb, #22c55e)",
                                            boxShadow: "0 4px 20px rgba(34, 197, 94, 0.4)",
                                        },
                                    }}
                                >
                                    {navbarData.button.label}
                                </Button>
                            )}
                            {navbarData.button2 && (
                                <Button
                                    component={Link}
                                    href={navbarData.button2.href}
                                    variant="outlined"
                                    sx={{
                                        textTransform: "none",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        padding: "0.375rem 1.25rem",
                                        borderRadius: "9999px",
                                        fontSize: "0.95rem",
                                        fontWeight: 500,
                                        color: "#ffffff",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            borderColor: "rgba(255, 255, 255, 0.4)",
                                        },
                                    }}
                                >
                                    {navbarData.button2.label}
                                </Button>
                            )}
                            {navbarData.button1 && (
                                <Button
                                    component={Link}
                                    href={navbarData.button1.href}
                                    variant="contained"
                                    sx={{
                                        textTransform: "none",
                                        background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                        padding: "0.375rem 1.5rem",
                                        borderRadius: "9999px",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        color: "#ffffff",
                                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: "linear-gradient(to right, #2563eb, #22c55e)",
                                            boxShadow: "0 4px 20px rgba(34, 197, 94, 0.4)",
                                        },
                                    }}
                                >
                                    {navbarData.button1.label}
                                </Button>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            {/* Mobile Glassmorphic Navbar */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                {!isOpen ? (
                    // Closed state: simple pill
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "90vw",
                            borderRadius: "9999px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            backgroundColor: "rgba(18, 18, 18, 0.4)",
                            px: 3,
                            py: 1,
                            backdropFilter: "blur(12px)",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                            color: "#ffffff",
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                fontSize: "14px",
                                fontWeight: 600,
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "rgba(255, 255, 255, 0.9)",
                            }}
                        >
                            {navbarData.logo.title}
                        </Box>
                        <Button
                            onClick={() => setIsOpen(true)}
                            sx={{
                                minWidth: 0,
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                color: "#ffffff",
                                padding: 0,
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                            aria-label="Open menu"
                        >
                            <MenuIcon size={18} />
                        </Button>
                    </Box>
                ) : (
                    // Open state: unified single glassmorphic card container
                    <Box
                        sx={{
                            width: "90vw",
                            borderRadius: "20px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            backgroundColor: "rgba(18, 18, 18, 0.85)",
                            p: 2.5,
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
                            color: "#ffffff",
                            animation: "fadeIn 0.2s ease-out",
                            "@keyframes fadeIn": {
                                from: { opacity: 0, transform: "translateY(-8px)" },
                                to: { opacity: 1, transform: "translateY(0)" },
                            },
                        }}
                    >
                        {/* Header row inside card */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Box
                                component="span"
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    color: "rgba(255, 255, 255, 0.9)",
                                }}
                            >
                                {navbarData.logo.title}
                            </Box>
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
                                    padding: 0,
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                                aria-label="Close menu"
                            >
                                <XIcon size={18} />
                            </Button>
                        </Box>

                        {/* Menu Links */}
                        <List sx={{ width: "100%", padding: 0, mb: 2 }}>
                            {navbarData.menuItems.map((item) => (
                                <ListItem
                                    key={item.label}
                                    disablePadding
                                    sx={{
                                        flexDirection: "column",
                                        alignItems: "stretch",
                                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                                        "&:last-child": {
                                            borderBottom: "none",
                                        },
                                    }}
                                >
                                    {item.submenu ? (
                                        <Box sx={{ width: "100%" }}>
                                            <ListItemButton
                                                onClick={() => toggleSubmenu(item.label)}
                                                sx={{
                                                    justifyContent: "space-between",
                                                    color: "rgba(255, 255, 255, 0.8)",
                                                    py: 1.25,
                                                    px: 1,
                                                    borderRadius: "8px",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                        color: "#3b82f6",
                                                    },
                                                }}
                                            >
                                                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "16px", fontWeight: 500 }} />
                                                <ChevronDown
                                                    size={16}
                                                    style={{
                                                        transition: "transform 0.2s ease",
                                                        transform: openSubmenu === item.label ? "rotate(180deg)" : "none",
                                                    }}
                                                />
                                            </ListItemButton>
                                            <Collapse in={openSubmenu === item.label} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding sx={{ pl: 2, borderLeft: "1px solid rgba(255, 255, 255, 0.1)", mt: 0.5, mb: 1 }}>
                                                    {item.submenu.map((sub) => (
                                                        <ListItem key={sub.label} disablePadding>
                                                            <ListItemButton
                                                                component={Link}
                                                                href={sub.href}
                                                                onClick={() => setIsOpen(false)}
                                                                sx={{
                                                                    py: 1,
                                                                    px: 1.5,
                                                                    borderRadius: "6px",
                                                                    color: "rgba(255, 255, 255, 0.7)",
                                                                    "&:hover": {
                                                                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                                        color: "#3b82f6",
                                                                    },
                                                                }}
                                                            >
                                                                <ListItemText primary={sub.label} primaryTypographyProps={{ fontSize: "14px", fontWeight: 400 }} />
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
                                            sx={{
                                                color: "rgba(255, 255, 255, 0.8)",
                                                py: 1.25,
                                                px: 1,
                                                borderRadius: "8px",
                                                "&:hover": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                                    color: "#3b82f6",
                                                },
                                            }}
                                        >
                                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "16px", fontWeight: 500 }} />
                                        </ListItemButton>
                                    )}
                                </ListItem>
                            ))}
                        </List>

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
                            {loading ? (
                                <Skeleton 
                                    variant="rectangular" 
                                    width="100%" 
                                    height={48} 
                                    animation="wave"
                                    sx={{ borderRadius: "9999px", bgcolor: "rgba(255, 255, 255, 0.08)" }} 
                                />
                            ) : user ? (
                                <>
                                    <Box component="span" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "15px", fontWeight: 500, textAlign: "center", mb: 0.5 }}>
                                        Hi, {user.name}
                                    </Box>
                                    <Button
                                        onClick={() => {
                                            logout();
                                            setIsOpen(false);
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            textTransform: "none",
                                            py: 1.25,
                                            borderRadius: "9999px",
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            color: "#ffffff",
                                            border: "1px solid rgba(255, 255, 255, 0.2)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                borderColor: "rgba(255, 255, 255, 0.4)",
                                            },
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : Array.isArray(navbarData.button) ? (
                                navbarData.button.map((btn, index) => (
                                    <Button
                                        key={btn.label}
                                        component={Link}
                                        href={btn.href}
                                        onClick={() => setIsOpen(false)}
                                        fullWidth
                                        variant={index === 0 ? "contained" : "outlined"}
                                        sx={{
                                            textTransform: "none",
                                            py: 1.25,
                                            borderRadius: "9999px",
                                            fontSize: "1rem",
                                            transition: "all 0.3s ease",
                                            ...(index === 0 ? {
                                                background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                                fontWeight: 600,
                                                color: "#ffffff",
                                                "&:hover": {
                                                    background: "linear-gradient(to right, #2563eb, #22c55e)",
                                                },
                                            } : {
                                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                                fontWeight: 500,
                                                color: "#ffffff",
                                                "&:hover": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                    borderColor: "rgba(255, 255, 255, 0.4)",
                                                },
                                            })
                                        }}
                                    >
                                        {btn.label}
                                    </Button>
                                ))
                            ) : (
                                <>
                                    {navbarData.button && !Array.isArray(navbarData.button) && (
                                        <Button
                                            component={Link}
                                            href={navbarData.button.href}
                                            onClick={() => setIsOpen(false)}
                                            fullWidth
                                            variant="contained"
                                            sx={{
                                                textTransform: "none",
                                                py: 1.25,
                                                borderRadius: "9999px",
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                color: "#ffffff",
                                                background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                                "&:hover": {
                                                    background: "linear-gradient(to right, #2563eb, #22c55e)",
                                                },
                                            }}
                                        >
                                            {navbarData.button.label}
                                        </Button>
                                    )}
                                    {navbarData.button1 && (
                                        <Button
                                            component={Link}
                                            href={navbarData.button1.href}
                                            onClick={() => setIsOpen(false)}
                                            fullWidth
                                            variant="contained"
                                            sx={{
                                                textTransform: "none",
                                                background: "linear-gradient(to right, #3b82f6, #4ade80)",
                                                py: 1.25,
                                                borderRadius: "9999px",
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                color: "#ffffff",
                                                "&:hover": {
                                                    background: "linear-gradient(to right, #2563eb, #22c55e)",
                                                },
                                            }}
                                        >
                                            {navbarData.button1.label}
                                        </Button>
                                    )}
                                    {navbarData.button2 && (
                                        <Button
                                            component={Link}
                                            href={navbarData.button2.href}
                                            onClick={() => setIsOpen(false)}
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                textTransform: "none",
                                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                                py: 1.25,
                                                borderRadius: "9999px",
                                                fontSize: "1rem",
                                                fontWeight: 500,
                                                color: "#ffffff",
                                                "&:hover": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                    borderColor: "rgba(255, 255, 255, 0.4)",
                                                },
                                            }}
                                        >
                                            {navbarData.button2.label}
                                        </Button>
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}