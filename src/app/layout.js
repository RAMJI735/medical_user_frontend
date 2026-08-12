import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../../services/authService/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "../../views/navbar/Navbar";
import Footer from "../../views/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Healthcare Expert - Digital Pharmacy & Care",
  description: "Authentic prescription medicines and daily healthcare services",
  verification: {
    google: "1K_6BSvbhJyx8ABDuuSgGFKL2AS5iJsej18dQo87_lw",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="1K_6BSvbhJyx8ABDuuSgGFKL2AS5iJsej18dQo87_lw" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#0f172a",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px"
              }
            }}
          />
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

