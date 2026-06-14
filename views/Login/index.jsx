"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { keyframes } from "@mui/system";
import { X, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AuthService } from "../../services/authService/authService";
import { useAuth } from "../../services/authService/AuthContext";

const scaleIn = keyframes`
  0% { opacity: 0; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
`;

export const Login = () => {
    const router = useRouter();
    const { setUser } = useAuth();
    const [openLogin, setOpenLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleClose = () => {
        setOpenLogin(false);
        router.push("/");
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
        try {
            const { email, password } = formData;
            const data = await AuthService.login(email, password);
            
            // Save user data to context state
            const userObj = data.user || data;
            setUser(userObj);

            alert("Logged in successfully!");
            router.push("/");
        } catch (err) {
            console.error("Login error:", err);
            const errMsg = err.response?.data?.message || err.message || "Failed to log in";
            setErrorMsg(errMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!openLogin) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100vw",
                backgroundColor: "#020617",
                overflowY: "auto",
                padding: 3,
            }}
        >
            {/* Premium Glowing Orbs in Background */}
            <Box
                sx={{
                    position: "absolute",
                    top: "15%",
                    left: "20%",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "15%",
                    right: "20%",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    pointerEvents: "none",
                }}
            />

            {/* Glassmorphic Modal Card */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "460px",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: "rgba(15, 23, 42, 0.65)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
                    p: { xs: 4, sm: 5 },
                    zIndex: 10,
                    color: "#ffffff",
                    animation: `${scaleIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                }}
            >
                {/* Close Button */}
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        color: "rgba(255, 255, 255, 0.5)",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            color: "#ffffff",
                            backgroundColor: "rgba(255, 255, 255, 0.12)",
                            transform: "rotate(90deg)",
                        }
                    }}
                    aria-label="Close dialog"
                >
                    <X size={18} />
                </IconButton>

                {/* Header */}
                <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            background: "linear-gradient(to right, #3b82f6, #4ade80)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Sign in to continue to your dashboard
                    </Typography>
                </Box>

                {/* Input Fields */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 3 }}>
                    <TextField
                        fullWidth
                        required
                        type="email"
                        label="Email Address"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ color: "rgba(255, 255, 255, 0.4)", mr: 1 }}>
                                    <Mail size={18} />
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />

                    <TextField
                        fullWidth
                        required
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ color: "rgba(255, 255, 255, 0.4)", mr: 1 }}>
                                    <Lock size={18} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "rgba(255, 255, 255, 0.4)" }}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={textFieldStyle}
                    />
                </Box>

                {/* Remember Me Checkbox */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.rememberMe}
                            onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                            sx={{
                                color: "rgba(255, 255, 255, 0.3)",
                                "&.Mui-checked": {
                                    color: "#3b82f6",
                                },
                            }}
                        />
                    }
                    label={
                        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.65)" }}>
                            Remember me
                        </Typography>
                    }
                    sx={{ mb: 3, alignItems: "center" }}
                />

                {/* Error message display */}
                {errorMsg && (
                    <Box
                        sx={{
                            p: 1.5,
                            mb: 3,
                            borderRadius: "12px",
                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#f87171",
                            textAlign: "center",
                            fontSize: "0.875rem",
                        }}
                    >
                        {errorMsg}
                    </Box>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        textTransform: "none",
                        background: "linear-gradient(to right, #3b82f6, #4ade80)",
                        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            background: "linear-gradient(to right, #2563eb, #22c55e)",
                            boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
                            transform: "translateY(-1px)",
                        },
                        "&.Mui-disabled": {
                            background: "rgba(255, 255, 255, 0.12)",
                            color: "rgba(255, 255, 255, 0.3)",
                            boxShadow: "none",
                        }
                    }}
                >
                    {loading ? "Signing In..." : "Sign In"}
                </Button>

                {/* Don't have an account link */}
                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.45)" }}>
                        Don't have an account?{" "}
                        <Box
                            component="span"
                            onClick={() => router.push("/dashboard/signup")}
                            sx={{
                                color: "#3b82f6",
                                fontWeight: 500,
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline", color: "#60a5fa" }
                            }}
                        >
                            Sign Up
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

// Reusable custom styling for TextField elements in dark/glassmorphic UI
const textFieldStyle = {
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
            borderWidth: "1px",
        },
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255, 255, 255, 0.45)",
        "&.Mui-focused": {
            color: "#3b82f6",
        },
    },
    "& .MuiOutlinedInput-input": {
        "&::placeholder": {
            color: "rgba(255, 255, 255, 0.3)",
            opacity: 1,
        },
    },
};
