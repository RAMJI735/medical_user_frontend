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
import CircularProgress from "@mui/material/CircularProgress";
import { Mail, Lock, KeyRound, ArrowLeft, Eye, EyeOff, Pill, CheckCircle2 } from "lucide-react";
import { AuthService } from "../../services/authService/authService";
import { toast } from "react-hot-toast";

export const ForgotPassword = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [demoOtpNotice, setDemoOtpNotice] = useState("");

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setDemoOtpNotice("");
        setLoading(true);

        try {
            const data = await AuthService.forgotPassword(email);
            setResetToken(data.resetToken || "");
            if (data.otp) {
                setDemoOtpNotice(`Demo Reset Code: ${data.otp}`);
            }
            setSuccessMsg("Password reset code sent to your email!");
            toast.success("Reset code dispatched");
            setStep(2);
        } catch (err) {
            console.error("Forgot password request error:", err);
            const msg = err.response?.data?.message || err.message || "Failed to request password reset code";
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try {
            await AuthService.resetPassword(email, otp, newPassword, resetToken);
            toast.success("Password reset successfully! Please login.");
            router.push("/dashboard/login");
        } catch (err) {
            console.error("Reset password error:", err);
            const msg = err.response?.data?.message || err.message || "Failed to reset password";
            setErrorMsg(msg);
            toast.error(msg);
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
            <Box
                className="glass-panel"
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "440px",
                    borderRadius: "28px",
                    p: { xs: 3.5, sm: 5 },
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Button
                        component={Link}
                        href="/dashboard/login"
                        startIcon={<ArrowLeft size={16} />}
                        sx={{ color: "rgba(255, 255, 255, 0.7)", textTransform: "none", fontSize: "0.85rem" }}
                    >
                        Back to Login
                    </Button>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Pill size={20} className="text-blue-400" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#ffffff" }}>
                            Healthcare Expert
                        </Typography>
                    </Link>
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff", mb: 0.5 }}>
                    Reset Password
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 3.5 }}>
                    {step === 1 ? "Enter your registered email to receive a password reset security code." : "Enter your security code and create a new password."}
                </Typography>

                {errorMsg && (
                    <Box sx={{ p: 1.5, mb: 3, borderRadius: "12px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#f87171", fontSize: "0.85rem" }}>
                        {errorMsg}
                    </Box>
                )}

                {demoOtpNotice && (
                    <Box sx={{ p: 1.5, mb: 3, borderRadius: "12px", backgroundColor: "rgba(59, 130, 246, 0.2)", border: "1px solid #3b82f6", color: "#38bdf8", fontSize: "0.85rem", fontWeight: 700 }}>
                        {demoOtpNotice}
                    </Box>
                )}

                {step === 1 ? (
                    <Box component="form" onSubmit={handleRequestOtp} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <TextField
                            label="Email Address"
                            type="email"
                            required
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                        <Button
                            type="submit"
                            disabled={loading}
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.4,
                                borderRadius: "14px",
                                background: "linear-gradient(to right, #3b82f6, #10b981)",
                                fontWeight: 700,
                                textTransform: "none",
                                fontSize: "1rem",
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Code"}
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleResetPassword} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Reset Code (OTP)"
                            required
                            fullWidth
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyRound size={18} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
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
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            required
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock size={18} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
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

                        <TextField
                            label="Confirm New Password"
                            type={showPassword ? "text" : "password"}
                            required
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock size={18} style={{ color: "rgba(255, 255, 255, 0.5)" }} />
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
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ForgotPassword;
