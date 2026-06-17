import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../../services/authService/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "../../views/navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shaadi Expert",
  description: "Wedding planning services for Lucknow couples",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body>
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
        </AuthProvider>
      </body>
    </html>
  );
}
