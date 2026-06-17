'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MedicineService } from '../../services/medicineService/medicineService'
import { useAuth } from '../../services/authService/AuthContext'
import { CartService } from '../../services/cartService/cartService'
import { toast } from 'react-hot-toast'
import { Pill, ShoppingCart, ShieldAlert, Heart, Calendar, Sparkles } from 'lucide-react'

function Index() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoryId = searchParams.get("category") || ""
    const { user } = useAuth()

    const [medicines, setMedicines] = useState([])
    const [loading, setLoading] = useState(true)
    const [addedMeds, setAddedMeds] = useState({})
    const [favorites, setFavorites] = useState({})
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return;
        async function fetchMedicines() {
            setLoading(true)
            try {
                if (categoryId) {
                    const res = await MedicineService.getMedicinesByCategory(categoryId, 1, 30)
                    setMedicines(res?.medicines || res?.data?.medicines || [])
                } else {
                    const res = await MedicineService.getAllMedicines("", "", 1, 30)
                    setMedicines(res?.medicines || res?.data?.medicines || [])
                }
            } catch (err) {
                console.error("Failed to load medicines:", err)
                toast.error("Failed to load medicines.")
            } finally {
                setLoading(false)
            }
        }
        fetchMedicines()
    }, [categoryId, mounted])

    const handleAddToCart = async (medId) => {
        if (!user) {
            toast.error("Please login to add items to your cart.");
            router.push('/dashboard/login');
            return;
        }
        try {
            await CartService.addToCart(medId, 1);
            toast.success("Added to cart successfully!");
            setAddedMeds(prev => ({ ...prev, [medId]: true }))
            setTimeout(() => {
                setAddedMeds(prev => ({ ...prev, [medId]: false }))
            }, 1500)
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast.error(error.response?.data?.message || "Failed to add item to cart.");
        }
    }

    const toggleFavorite = (medId) => {
        setFavorites(prev => ({ ...prev, [medId]: !prev[medId] }))
        const isFav = !favorites[medId];
        toast(isFav ? "Added to Wishlist!" : "Removed from Wishlist!", {
            icon: isFav ? "💖" : "💔",
            style: {
                background: "#0f172a",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.08)"
            }
        });
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#020617] text-white pt-36 md:pt-40 pb-16 px-6 md:px-12 medicines-page-container">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-32">
                    <Pill className="w-12 h-12 text-blue-500/50 mb-4 animate-bounce" />
                    <span className="text-slate-400 font-medium">Loading catalog...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-36 md:pt-40 pb-16 px-6 md:px-12 medicines-page-container">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-3">
                            <Pill className="w-8 h-8 text-blue-400" />
                            Explore Medicines
                        </h1>
                        <p className="text-slate-400 mt-2 max-w-lg">
                            Premium formulations selected for effective relief and daily healthcare support.
                        </p>
                    </div>
                    
                    {/* View Cart Button */}
                    <Link 
                        href="/dashboard/cart"
                        className="flex items-center gap-2 bg-[#0f172a]/80 hover:bg-[#1e293b]/80 text-white border border-white/10 hover:border-blue-500/40 px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-blue-500/10 hover:-translate-y-0.5"
                    >
                        <ShoppingCart className="w-5 h-5 text-blue-400" />
                        <span>View Cart</span>
                    </Link>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse bg-slate-900/40 border border-white/5 rounded-2xl h-[420px]">
                                <div className="bg-slate-800/60 h-52 w-full rounded-t-2xl" />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-slate-800/60 rounded w-2/3" />
                                    <div className="h-4 bg-slate-800/60 rounded w-full" />
                                    <div className="h-4 bg-slate-800/60 rounded w-5/6" />
                                    <div className="h-10 bg-slate-800/60 rounded w-full mt-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : medicines.length === 0 ? (
                    <div className="text-center py-24 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
                        <ShieldAlert className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-70" />
                        <p className="text-slate-400 text-lg font-medium">No medicines registered in this category.</p>
                        <p className="text-slate-600 text-sm mt-1">Please select another segment or explore the full shop listing.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {medicines.map((med) => {
                            const isAdded = addedMeds[med._id];
                            const isFav = favorites[med._id];
                            
                            // 1. Dynamic pricing resolution (sellingPrice is the primary API field)
                            const price = typeof med.sellingPrice === 'number' 
                                ? med.sellingPrice 
                                : (parseFloat(med.sellingPrice) || (typeof med.price === 'number' ? med.price : (parseFloat(med.price) || 0)));
                            const mrp = typeof med.mrp === 'number' 
                                ? med.mrp 
                                : (parseFloat(med.mrp) || Math.round(price * 1.3) || 0);
                            const discountPercentage = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

                            // 2. Safe manufacturer extraction
                            const brandName = med.manufacturer?.brandName || (typeof med.manufacturer === 'string' ? med.manufacturer : "");

                            // 3. Expiry date calculation
                            const expiryDateObj = med.expiryDate ? new Date(med.expiryDate) : null;
                            const isExpired = expiryDateObj ? expiryDateObj < new Date() : false;
                            const isExpiringSoon = expiryDateObj && !isExpired && (expiryDateObj - new Date()) < (45 * 24 * 60 * 60 * 1000); // 45 days threshold
                            const expiryLabel = expiryDateObj 
                                ? expiryDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                : null;

                            // 4. Subtitle formatting (dosageForm & generic name combined)
                            const genericDisplay = med.genericName 
                                ? `${med.genericName}${med.strength ? ` (${med.strength})` : ""}`
                                : `${med.dosageForm || "Tablet"}${med.strength ? ` (${med.strength})` : ""}`;

                            return (
                                <div key={med._id} className="group bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-2 hover:border-blue-500/35 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                                    <div>
                                        {/* Image Section */}
                                        <div className="relative h-52 bg-slate-950/40 overflow-hidden">
                                            <img
                                                src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60"}
                                                alt={med.medicineName || "Medicine"}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            
                                            {/* Top Overlays */}
                                            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                                                {/* Rx Prescription requirement indicator */}
                                                <div>
                                                    {med.prescriptionRequired && (
                                                        <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded border border-red-500/25 pointer-events-auto">
                                                            Rx Required
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Favorite Toggle button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavorite(med._id);
                                                    }}
                                                    className="bg-slate-900/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 text-white hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200 pointer-events-auto"
                                                >
                                                    <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                                                </button>
                                            </div>

                                            {/* Stock / Expiry tag */}
                                            {isExpired ? (
                                                <span className="absolute bottom-3 right-3 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md border border-red-500/30">
                                                    Expired
                                                </span>
                                            ) : med.stock <= 0 ? (
                                                <span className="absolute bottom-3 right-3 bg-red-500/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md border border-red-500/30">
                                                    Out of Stock
                                                </span>
                                            ) : isExpiringSoon ? (
                                                <span className="absolute bottom-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md border border-amber-500/35 animate-pulse">
                                                    Expiring Soon
                                                </span>
                                            ) : med.stock < 10 ? (
                                                <span className="absolute bottom-3 right-3 bg-amber-500/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md border border-amber-500/30">
                                                    Low Stock ({med.stock})
                                                </span>
                                            ) : (
                                                <span className="absolute bottom-3 right-3 bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md border border-emerald-500/30">
                                                    In Stock
                                                </span>
                                            )}
                                        </div>

                                        {/* Card content */}
                                        <div className="p-5 pb-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block line-clamp-1">
                                                    {genericDisplay}
                                                </span>
                                                {brandName && (
                                                    <span className="text-[9px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded font-medium">
                                                        {brandName}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h2 className="text-xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                                                {med.medicineName || "Unknown Medicine"}
                                            </h2>
                                            
                                            <p className="text-slate-400 text-sm mt-3 line-clamp-2 leading-relaxed min-h-[40px]">
                                                {med.description || "Effective formulation recommended for therapy and recovery."}
                                            </p>

                                            {expiryLabel && (
                                                <div className={`flex items-center gap-1 mt-3 text-[11px] ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-slate-500'}`}>
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>Expiry: {expiryLabel}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Section */}
                                    <div className="p-5 pt-0">
                                        <div className="flex items-center justify-between mt-5">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-extrabold text-emerald-400">
                                                    ₹{price}
                                                </span>
                                                {mrp > price && (
                                                    <span className="text-xs text-slate-500 line-through">
                                                        ₹{mrp}
                                                    </span>
                                                )}
                                            </div>

                                            {discountPercentage > 0 && (
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-extrabold">
                                                    {discountPercentage}% OFF
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(med._id)}
                                            disabled={med.stock <= 0 || isExpired}
                                            className={`w-full mt-5 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                                                isExpired
                                                    ? "bg-red-950/20 text-red-700 cursor-not-allowed border border-red-900/20"
                                                    : med.stock <= 0
                                                    ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5"
                                                    : isAdded
                                                    ? "bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.01]"
                                            }`}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {isExpired 
                                                ? "Expired / Restrict" 
                                                : med.stock <= 0 
                                                ? "Out of Stock" 
                                                : isAdded 
                                                ? "Added to Cart!" 
                                                : "Add To Cart"
                                            }
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Index