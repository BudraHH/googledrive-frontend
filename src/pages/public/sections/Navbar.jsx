import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Menu, X, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from '@/routes/routes';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '#features' },
        { name: 'How it Works', path: '#how-it-works' },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-16 xl:h-20 flex items-center",
                isScrolled
                    ? "border-b border-sky-100 bg-white/80 backdrop-blur-xl shadow-sm"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-gradient-to-br from-sky-600 to-[#082f49] text-white shadow-lg shadow-sky-600/20 group-hover:scale-105 transition-transform duration-300">
                        <Cloud size={20} fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-[#082f49]">
                        CloudDrive
                    </span>
                </Link>

                {/* Desktop Navigation (Centered) */}
                <div className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path || (link.path.startsWith('#') && location.hash === link.path);
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 group",
                                    isActive ? "text-sky-600" : "text-slate-600 hover:text-sky-600"
                                )}
                            >
                                <span className="relative z-10">{link.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active-bg"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full mx-4"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="h-4 w-px bg-slate-200 mx-2" />
                    <Button
                        as={Link}
                        to={ROUTES.PUBLIC.LOGIN}
                        variant="ghost"
                        size="sm"
                    >
                        Sign In
                    </Button>
                    <Button
                        as={Link}
                        to={ROUTES.PUBLIC.SIGNUP}
                        variant="primary"
                        size="sm"
                    >
                        Get Started
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <Button variant="ghost" size="icon" className="rounded-xl text-[#082f49]">
                        <Menu size={24} />
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
