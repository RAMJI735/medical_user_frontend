"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { keyframes } from "@mui/system";
import { X, Mail, Lock, KeyRound, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AuthService } from "../../services/authService/authService";

const scaleIn = keyframes`
  0% { opacity: 0; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
`;

export const ForgotPassword = () => {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email input, 2: OTP & New Password input
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

    const handleClose = () => {
        router.push("/");
    };

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
            setSuccessMsg("Password reset code has been sent to your email.");
            setStep(2);
        } catch (err) {
            console.error("Forgot password request error:", err);
            const msg = err.response?.data?.message || err.message || "Failed to request password reset code";
            setErrorMsg(msg);
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
            setErrorMsg("New password and confirm password do not match.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const data = await AuthService.resetPassword({
                email,
                otp,
                resetToken,
                newPassword,
            });

            setSuccessMsg(data.message || "Password reset successful!");
            setTimeout(() => {
                router.push("/dashboard/login");
            }, 2000);
        } catch (err) {
            console.error("Reset password error:", err);
            const msg = err.response?.data?.message || err.message || "Failed to reset password";
            setErrorMsg(msg);
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
                padding: 3,
            }}
        >
            {/* Background Orbs */}
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

            {/* Glassmorphic Container Card */}
            <Box
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
                    aria-label="Close"
                >
                    <X size={18} />
                </IconButton>

                {/* Back to Login Button */}
                <Button
                    onClick={() => router.push("/dashboard/login")}
                    startIcon={<ArrowLeft size={16} />}
                    sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        textTransform: "none",
                        fontWeight: 600,
                        mb: 3,
                        px: 0,
                        minWidth: "auto",
                        "&:hover": { color: "#ffffff", backgroundColor: "transparent" }
                    }}
                >
                    Back to Sign In
                </Button>

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
                        {step === 1 ? "Forgot Password?" : "Reset Password"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        {step === 1
                            ? "Enter your registered email address to receive a verification code"
                            : `Enter the code sent to ${email} and your new password`}
                    </Typography>
                </Box>

                {/* Success Banner */}
                {successMsg && (
                    <Box
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: "12px",
                            backgroundColor: "rgba(34, 197, 94, 0.15)",
                            border: "1px solid rgba(34, 197, 94, 0.3)",
                            color: "#4ade80",
                            textAlign: "center",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1
                        }}
                    >
                        <CheckCircle2 size={18} />
                        {successMsg}
                    </Box>
                )}

                {/* Demo OTP Notice */}
                {demoOtpNotice && (
                    <Box
                        sx={{
                            p: 1.5,
                            mb: 3,
                            borderRadius: "12px",
                            backgroundColor: "rgba(59, 130, 246, 0.15)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            color: "#60a5fa",
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                        }}
                    >
                        {demoOtpNotice}
                    </Box>
                )}

                {/* Error Banner */}
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

                {step === 1 ? (
                    /* Step 1 Form */
                    <Box component="form" onSubmit={handleRequestOtp}>
                        <TextField
                            fullWidth
                            required
                            type="email"
                            label="Registered Email Address"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ color: "rgba(255, 255, 255, 0.4)", mr: 1 }}>
                                        <Mail size={18} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ ...textFieldStyle, mb: 3 }}
                        />

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
                                },
                            }}
                        >
                            {loading ? "Sending Code..." : "Send Reset Code"}
                        </Button>
                    </Box>
                ) : (
                    /* Step 2 Form */
                    <Box component="form" onSubmit={handleResetPassword}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 3 }}>
                            <TextField
                                fullWidth
                                required
                                label="6-Digit Reset Code (OTP)"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "rgba(255, 255, 255, 0.4)", mr: 1 }}>
                                            <KeyRound size={18} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyle}
                            />

                            <TextField
                                fullWidth
                                required
                                type={showPassword ? "text" : "password"}
                                label="New Password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "rgba(255, 255, 255, 0.4)", mr: 1 }}>
                                            <Lock size={18} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "rgba(255, 255, 255, 0.4)" }}>
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyle}
                            />

                            <TextField
                                fullWidth
                                required
                                type={showPassword ? "text" : "password"}
                                label="Confirm New Password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "rgba(255, 255, 255, 0.4)", mr: 1 }}>
                                            <Lock size={18} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={textFieldStyle}
                            />
                        </Box>

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
                                },
                            }}
                        >
                            {loading ? "Resetting Password..." : "Update Password"}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Button
                                onClick={() => setStep(1)}
                                size="small"
                                sx={{ color: "rgba(255, 255, 255, 0.5)", textTransform: "none" }}
                            >
                                Resend code to another email
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

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
