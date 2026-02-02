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

    const [activeSection, setActiveSection] = useState('#hero');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -40% 0px', // Offset for navbar and triggers earlier
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = `#${entry.target.id}`;
                    setActiveSection(id);

                    // Update URL: use root path for hero, hash for others
                    const newUrl = id === '#hero' ? '/' : id;
                    const currentHashOrPath = id === '#hero' ? window.location.hash : window.location.hash;

                    if (id === '#hero') {
                        if (window.location.hash !== '') {
                            window.history.replaceState(null, '', '/');
                        }
                    } else if (window.location.hash !== id) {
                        window.history.replaceState(null, '', id);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = ['hero', 'features', 'how-it-works'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (e, path) => {
        if (path.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(path);
            if (element) {
                const navHeight = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Set active section immediately on click
                setActiveSection(path);
                const newUrl = path === '#hero' ? '/' : path;
                window.history.pushState(null, '', newUrl);
            }
        }
    };

    const navLinks = [
        { name: 'Home', path: '#hero' },
        { name: 'Features', path: '#features' },
        { name: 'How it Works', path: '#how-it-works' },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <Link
                    to="/"
                    onClick={(e) => scrollToSection(e, '#hero')}
                    className="flex items-center gap-2.5 group"
                >
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
                        const isActive = activeSection === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={(e) => scrollToSection(e, link.path)}
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
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl text-[#082f49]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-16 left-0 right-0 bg-white border-b border-sky-100 overflow-hidden lg:hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={(e) => {
                                        scrollToSection(e, link.path);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-lg font-semibold text-slate-600 hover:text-sky-600 px-4 py-2"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-slate-100 my-2" />
                            <div className="flex flex-col gap-3">
                                <Button
                                    as={Link}
                                    to={ROUTES.PUBLIC.LOGIN}
                                    variant="ghost"
                                    className="w-full justify-start text-lg"
                                >
                                    Sign In
                                </Button>
                                <Button
                                    as={Link}
                                    to={ROUTES.PUBLIC.SIGNUP}
                                    variant="primary"
                                    className="w-full text-lg h-12"
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
