"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { Eye, EyeOff, Mail, Lock, User, Phone, Pill, ArrowLeft } from "lucide-react";
import { AuthService } from "../../services/authService/authService";
import { toast } from "react-hot-toast";

export const Signup = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        type: "user",
        email: "",
        password: "",
        agree: true
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
        try {
            const { name, phone, type, email, password } = formData;
            await AuthService.signup({ name, phone, type, email, password });
            toast.success(`Account created successfully for ${email}!`);
            router.push("/dashboard/login");
        } catch (err) {
            console.error("Signup error:", err);
            const errMsg = err.response?.data?.message || err.message || "Failed to create account";
            setErrorMsg(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

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
                p: { xs: 2, sm: 4 },
            }}
        >
            {/* Ambient Lighting */}
            <Box
                sx={{
                    position: "absolute",
                    top: "15%",
                    left: "20%",
                    width: "350px",
                    height: "350px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                    filter: "blur(50px)",
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
                    background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
                    filter: "blur(50px)",
                    pointerEvents: "none",
                }}
            />

            {/* Signup Form Card */}
            <Box
                className="glass-panel"
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "480px",
                    borderRadius: "28px",
                    p: { xs: 3.5, sm: 5 },
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
                    my: 4,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ color: "rgba(255, 255, 255, 0.7)", textTransform: "none", fontSize: "0.85rem" }}
                    >
                        Home
                    </Button>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Pill size={20} className="text-blue-400" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff" }}>
                            Healthcare Expert
                        </Typography>
                    </Link>
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", mb: 0.5, letterSpacing: "-0.02em" }}>
                    Create Account
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 3.5 }}>
                    Join Healthcare Expert for quick prescription refills & digital care.
                </Typography>

                {errorMsg && (
                    <Box sx={{ p: 1.5, mb: 3, borderRadius: "12px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", fontSize: "0.85rem" }}>
                        {errorMsg}
                    </Box>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Full Name"
                        required
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={18} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
                                    </InputAdornment>
                                ),
                                style: { color: "#ffffff" }
                            }
                        }}
                        sx={{
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            borderRadius: "14px",
                            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.75)" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.5)" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" }
                        }}
                    />

                    <TextField
                        label="Phone Number"
                        type="tel"
                        required
                        fullWidth
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone size={18} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
                                    </InputAdornment>
                                ),
                                style: { color: "#ffffff" }
                            }
                        }}
                        sx={{
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            borderRadius: "14px",
                            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.75)" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.5)" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" }
                        }}
                    />

                    <TextField
                        label="Email Address"
                        type="email"
                        required
                        fullWidth
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mail size={18} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
                                    </InputAdornment>
                                ),
                                style: { color: "#ffffff" }
                            }
                        }}
                        sx={{
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            borderRadius: "14px",
                            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.75)" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.5)" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" }
                        }}
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        required
                        fullWidth
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock size={18} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                style: { color: "#ffffff" }
                            }
                        }}
                        sx={{
                            backgroundColor: "rgba(15, 23, 42, 0.8)",
                            borderRadius: "14px",
                            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.75)" },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#38bdf8" },
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(59, 130, 246, 0.5)" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" }
                        }}
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        fullWidth
                        variant="contained"
                        sx={{
                            py: 1.4,
                            mt: 1,
                            borderRadius: "14px",
                            background: "linear-gradient(to right, #3b82f6, #10b981)",
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "1rem",
                            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                            "&:hover": {
                                background: "linear-gradient(to right, #2563eb, #059669)",
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                    </Button>
                </Box>

                <Box sx={{ textAlign: "center", mt: 3.5, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                        Already registered?{" "}
                        <Link href="/dashboard/login" style={{ color: "#38bdf8", fontWeight: 700 }}>
                            Sign In Here
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Signup;