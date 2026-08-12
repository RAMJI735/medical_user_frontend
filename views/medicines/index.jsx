'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MedicineService } from '../../services/medicineService/medicineService'
import { CategoryService } from '../../services/categoryService/categoryService'
import { useAuth } from '../../services/authService/AuthContext'
import { CartService } from '../../services/cartService/cartService'
import { toast } from 'react-hot-toast'
import { 
    Pill, 
    ShoppingCart, 
    ShieldAlert, 
    Heart, 
    Calendar, 
    Sparkles, 
    Search,
    Filter,
    CheckCircle2
} from 'lucide-react'

function Index() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoryId = searchParams.get("category") || ""
    const { user } = useAuth()

    const [medicines, setMedicines] = useState([])
    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState(categoryId)
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [addedMeds, setAddedMeds] = useState({})
    const [favorites, setFavorites] = useState({})
    const [mounted, setMounted] = useState(false)
    const [cartItems, setCartItems] = useState([])

    useEffect(() => {
        setMounted(true)
    }, [])

    // Load active categories for filter tabs
    useEffect(() => {
        if (!mounted) return;
        async function loadCategories() {
            try {
                const data = await CategoryService.getAllCategories("", "true");
                setCategories(data || []);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        }
        loadCategories();
    }, [mounted]);

    // Sync active category state from URL query
    useEffect(() => {
        setActiveCategory(categoryId);
    }, [categoryId]);

    // Load cart summary if user logged in
    useEffect(() => {
        if (!mounted || !user) return;
        async function fetchCartSummary() {
            try {
                const data = await CartService.getCartSummary();
                setCartItems(data || []);
            } catch (err) {
                console.error("Failed to load cart summary:", err);
            }
        }
        fetchCartSummary();
    }, [user, mounted]);

    // Fetch medicines dynamically based on category and search query
    useEffect(() => {
        if (!mounted) return;
        async function fetchMedicines() {
            setLoading(true)
            try {
                if (activeCategory) {
                    const res = await MedicineService.getMedicinesByCategory(activeCategory, 1, 40)
                    setMedicines(res?.medicines || res?.data?.medicines || [])
                } else {
                    const res = await MedicineService.getAllMedicines(searchQuery, "", 1, 40)
                    setMedicines(res?.medicines || res?.data?.medicines || [])
                }
            } catch (err) {
                console.error("Failed to load medicines:", err)
                toast.error("Failed to load medicines catalog.")
            } finally {
                setLoading(false)
            }
        }

        const timer = setTimeout(fetchMedicines, 300);
        return () => clearTimeout(timer);
    }, [activeCategory, searchQuery, mounted])

    const handleAddToCart = async (medId) => {
        if (!user) {
            toast.error("Please login to add items to your cart.");
            router.push('/dashboard/login');
            return;
        }
        try {
            await CartService.addToCart(medId, 1);
            toast.success("Item added to cart!");
            setAddedMeds(prev => ({ ...prev, [medId]: true }));
            setTimeout(() => {
                setAddedMeds(prev => ({ ...prev, [medId]: false }));
            }, 1500);

            // Dispatch global event for navbar update
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("cart-updated"));
            }
            
            // Refresh cart items summary
            const data = await CartService.getCartSummary();
            setCartItems(data || []);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast.error(error.response?.data?.message || "Failed to add item to cart.");
        }
    }

    const toggleFavorite = (medId) => {
        setFavorites(prev => ({ ...prev, [medId]: !prev[medId] }));
        const isFav = !favorites[medId];
        toast(isFav ? "Saved to Wishlist!" : "Removed from Wishlist!", {
            icon: isFav ? "💖" : "💔",
            style: {
                background: "#0f172a",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.08)"
            }
        });
    }

    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    // Client side filter by search input if needed
    const filteredMedicines = medicines.filter(m => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            (m.medicineName && m.medicineName.toLowerCase().includes(q)) ||
            (m.genericName && m.genericName.toLowerCase().includes(q))
        );
    });

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#020617] text-white pt-28 pb-16 px-6 medicines-page-container">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-32">
                    <Pill className="w-12 h-12 text-blue-500/50 mb-4 animate-bounce" />
                    <span className="text-slate-400 font-medium">Loading catalog...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-12 medicines-page-container">
            <div className="max-w-7xl mx-auto">
                {/* Header & Cart Quick Action */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>100% Licensed Digital Pharmacy</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-3">
                            <Pill className="w-8 h-8 text-blue-400" />
                            Explore Medicines Catalog
                        </h1>
                        <p className="text-slate-400 mt-2 max-w-lg text-sm sm:text-base">
                            Browse certified pharmaceutical formulations, generic substitutes, and daily healthcare support.
                        </p>
                    </div>

                    <Link 
                        href="/dashboard/cart"
                        className="relative flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-white border border-white/10 hover:border-blue-500/50 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-black/40 hover:-translate-y-0.5"
                    >
                        <ShoppingCart className="w-5 h-5 text-blue-400" />
                        <span>View Cart</span>
                        {cartCount > 0 && (
                            <span className="flex items-center justify-center bg-blue-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1.5 ml-1 animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Search Bar & Category Filter Chips */}
                <div className="mb-10 space-y-4">
                    <div className="relative max-w-2xl mx-auto md:mx-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by medicine name, generic chemical, or brand..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/80 border border-white/10 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 outline-none transition-all text-sm sm:text-base"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            onClick={() => {
                                setActiveCategory("");
                                router.push("/dashboard/medicine");
                            }}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                activeCategory === ""
                                    ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md shadow-blue-500/20"
                                    : "bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                            }`}
                        >
                            All Medicines
                        </button>
                        {categories.map((cat) => {
                            const isSelected = activeCategory === cat._id;
                            return (
                                <button
                                    key={cat._id}
                                    onClick={() => {
                                        setActiveCategory(cat._id);
                                        router.push(`/dashboard/medicine?category=${cat._id}`);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                        isSelected
                                            ? "bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md shadow-blue-500/20"
                                            : "bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    {cat.categoryName}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Catalog Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="animate-pulse bg-slate-900/40 border border-white/5 rounded-2xl h-[420px]">
                                <div className="bg-slate-800/60 h-48 w-full rounded-t-2xl" />
                                <div className="p-5 space-y-3">
                                    <div className="h-6 bg-slate-800/60 rounded w-2/3" />
                                    <div className="h-4 bg-slate-800/60 rounded w-full" />
                                    <div className="h-4 bg-slate-800/60 rounded w-5/6" />
                                    <div className="h-10 bg-slate-800/60 rounded w-full mt-6" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredMedicines.length === 0 ? (
                    <div className="text-center py-24 bg-slate-900/40 border border-dashed border-white/10 rounded-3xl p-6">
                        <ShieldAlert className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-70" />
                        <p className="text-slate-300 text-lg font-semibold">No medicines found matching your criteria.</p>
                        <p className="text-slate-500 text-sm mt-1">Try resetting your search query or selecting another category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMedicines.map((med) => {
                            const isAdded = addedMeds[med._id];
                            const isFav = favorites[med._id];
                            const isInCart = cartItems.some(item => {
                                const itemId = typeof item.medicineId === 'object' && item.medicineId !== null 
                                    ? item.medicineId._id 
                                    : item.medicineId;
                                return String(itemId) === String(med._id);
                            });
                            
                            const price = typeof med.sellingPrice === 'number' 
                                ? med.sellingPrice 
                                : (parseFloat(med.sellingPrice) || (typeof med.price === 'number' ? med.price : (parseFloat(med.price) || 0)));
                            const mrp = typeof med.mrp === 'number' 
                                ? med.mrp 
                                : (parseFloat(med.mrp) || Math.round(price * 1.3) || 0);
                            const discountPercentage = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

                            const brandName = med.manufacturer?.brandName || (typeof med.manufacturer === 'string' ? med.manufacturer : "");

                            const expiryDateObj = med.expiryDate ? new Date(med.expiryDate) : null;
                            const isExpired = expiryDateObj ? expiryDateObj < new Date() : false;
                            const isExpiringSoon = expiryDateObj && !isExpired && (expiryDateObj - new Date()) < (45 * 24 * 60 * 60 * 1000);
                            const expiryLabel = expiryDateObj 
                                ? expiryDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                : null;

                            const genericDisplay = med.genericName 
                                ? `${med.genericName}${med.strength ? ` (${med.strength})` : ""}`
                                : `${med.dosageForm || "Tablet"}${med.strength ? ` (${med.strength})` : ""}`;

                            return (
                                <div 
                                    key={med._id} 
                                    className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div>
                                        {/* Image Box */}
                                        <div className="relative h-48 bg-slate-950/60 overflow-hidden">
                                            <img
                                                src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60"}
                                                alt={med.medicineName || "Medicine"}
                                                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                                            />
                                            
                                            {/* Overlays */}
                                            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                                                <div>
                                                    {med.prescriptionRequired && (
                                                        <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-0.5 rounded border border-red-500/30 pointer-events-auto">
                                                            Rx Required
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavorite(med._id);
                                                    }}
                                                    className="bg-slate-900/70 backdrop-blur-md p-1.5 rounded-full border border-white/10 text-white hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200 pointer-events-auto"
                                                >
                                                    <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                                                </button>
                                            </div>

                                            {/* Stock Badge */}
                                            {isExpired ? (
                                                <span className="absolute bottom-3 right-3 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md">
                                                    Expired
                                                </span>
                                            ) : med.stock <= 0 ? (
                                                <span className="absolute bottom-3 right-3 bg-red-500/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md">
                                                    Out of Stock
                                                </span>
                                            ) : isExpiringSoon ? (
                                                <span className="absolute bottom-3 right-3 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md animate-pulse">
                                                    Expiring Soon
                                                </span>
                                            ) : (
                                                <span className="absolute bottom-3 right-3 bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md">
                                                    In Stock
                                                </span>
                                            )}
                                        </div>

                                        {/* Card content */}
                                        <div className="p-5 pb-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block truncate">
                                                    {genericDisplay}
                                                </span>
                                                {brandName && (
                                                    <span className="text-[9px] bg-white/5 border border-white/10 text-slate-300 px-1.5 py-0.5 rounded font-medium">
                                                        {brandName}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h2 className="text-lg font-bold text-white mt-1.5 group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                                                {med.medicineName || "Unknown Medicine"}
                                            </h2>
                                            
                                            <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                                                {med.description || "Effective formulation recommended for daily care and recovery."}
                                            </p>

                                            {expiryLabel && (
                                                <div className={`flex items-center gap-1.5 mt-2.5 text-[11px] ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-slate-400'}`}>
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>Expiry: {expiryLabel}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer / Price & Add Button */}
                                    <div className="p-5 pt-0">
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-extrabold text-emerald-400">
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
                                            onClick={() => {
                                                if (isInCart) {
                                                    router.push('/dashboard/cart');
                                                } else {
                                                    handleAddToCart(med._id);
                                                }
                                            }}
                                            disabled={(med.stock <= 0 || isExpired) && !isInCart}
                                            className={`w-full mt-4 text-white py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                                isExpired
                                                    ? "bg-red-950/20 text-red-700 cursor-not-allowed border border-red-900/20"
                                                    : med.stock <= 0 && !isInCart
                                                    ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5"
                                                    : isInCart
                                                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-500/20"
                                                    : isAdded
                                                    ? "bg-emerald-600 shadow-md shadow-emerald-500/20"
                                                    : "bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 shadow-md shadow-blue-500/20"
                                            }`}
                                        >
                                            {isInCart ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>Go to Cart</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-4 h-4" />
                                                    <span>{isAdded ? "Added!" : "Add To Cart"}</span>
                                                </>
                                            )}
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