import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductMockup from './ProductMockup';
import { ROUTES } from '@/routes/routes';

// Optimization: Memoize the heavy ProductMockup component
const MemoizedProductMockup = React.memo(ProductMockup);

// Optimization: Extract static animation variants to prevent recreation on render
const FADE_UP_VARIANTS = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const STAT_ITEM_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const SEPARATOR_VARIANTS = {
    hidden: { opacity: 0, scaleY: 0 },
    visible: { opacity: 1, scaleY: 1, transition: { duration: 0.3 } }
};

const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.4,
        },
    },
};

const TEXT_REVEAL_VARIANTS = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

const TAGLINE_CONTAINER_VARIANTS = {
    hidden: { opacity: 0, x: -100, pointerEvents: "none" },
    visible: {
        opacity: 1,
        x: 0,
        pointerEvents: "auto",
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const Hero = () => {
    const sectionRef = useRef(null);
    const mockupRef = useRef(null);
    const progressRef = useRef(0);

    // Optimization: Initialize based on current window state to avoid hydration mismatch/double render if not SSR
    const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

    // State for thresholds
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [showTaglines, setShowTaglines] = useState(false);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        // Initial check is handled by state initializer, but we add listener
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    useEffect(() => {
        if (!isDesktop) return;

        let rafId;
        const handleScroll = () => {
            if (!sectionRef.current || !mockupRef.current) return;

            const { top, height } = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const end = height - windowHeight;
            const scrollY = -top;

            let progress = scrollY / end;
            progress = Math.max(0, Math.min(1, progress));

            progressRef.current = progress;

            // Update DOM directly to enable CSS calculations (Fast)
            mockupRef.current.style.setProperty('--scroll', progress);

            // Optimization: Only trigger React updates when crossing thresholds
            const shouldExpand = progress > 0.5;
            setSidebarExpanded(prev => {
                if (prev !== shouldExpand) return shouldExpand;
                return prev;
            });

            const shouldShowWrapper = progress > 0.9;
            setShowTaglines(prev => {
                if (prev !== shouldShowWrapper) return shouldShowWrapper;
                return prev;
            });
        };

        const onScroll = () => {
            if (document.body.dataset.navScrolling === 'true') return;
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
        };
    }, [isDesktop]);



    return (
        <section id="hero" ref={sectionRef} className="relative w-full h-auto lg:h-[190vh] bg-white overflow-hidden pt-12 lg:pt-0 pb-12 lg:pb-0" >


            <div className="relative lg:sticky top-0 min-h-screen flex items-center pt-8 md:pt-16 lg:pt-0">
                <div className="lg:container mx-auto w-full max-w-[1600px] px-4 md:px-8 lg:px-12 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-8 w-full">

                        {/* Left Column: Text Content */}
                        <div className="w-full lg:w-6/12 shrink-0 flex flex-col items-center text-center lg:items-start lg:text-left">
                            {/* Eyebrow Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex items-center gap-3"
                            >
                                <div className="h-px w-8 bg-brand-500/40" />
                                <span className="text-brand-600 font-bold text-xs uppercase whitespace-nowrap px-3 py-1.5 bg-brand-50/30">
                                    AWS S3 Powered Storage <span className="text-slate-300 font-bold text-xs uppercase whitespace-nowrap px-3 py-1.5 bg-brand-50/30">( Google Drive Clone )</span>
                                </span>
                                <div className="h-px flex-1 max-w-12 bg-brand-500/40" />
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                {...FADE_UP_VARIANTS}
                                className="text-4xl xs:text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-2"
                            >
                                Secured Cloud <br />
                                Storage for{' '}
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-brand-600">Everyone.</span>
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-xl text-lg lg:text-xl text-slate-500 font-medium leading-relaxed mb-2"
                            >
                                Store, share, and access your files from anywhere. Simple, reliable, and powered by AWS S3.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col sm:flex-row mt-4 gap-4 w-full sm:w-auto"
                            >
                                <Button
                                    as={Link}
                                    to={ROUTES.SIGNUP}
                                    size="lg"
                                    className="group "
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started for Free
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </Button>
                                <Button
                                    as={Link}
                                    to={ROUTES.WATCH_DEMO}
                                    variant="outline"
                                    size="lg"
                                    className="bg-slate-50 hover:bg-white"  >
                                    <Play className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                                    Watch How it Works
                                </Button>
                            </motion.div>

                            {/* Impact Stats */}
                            <div
                                className="my-8 lg:my-10 flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-10 text-slate-900"
                            >
                                {/* Metric */}
                                <motion.div variants={STAT_ITEM_VARIANTS}>
                                    <p className="text-xl sm:text-2xl font-semibold text-brand-600">100%</p>
                                    <p className="text-xs text-slate-500">Private Access</p>
                                </motion.div>

                                <motion.div
                                    variants={SEPARATOR_VARIANTS}
                                    className="hidden sm:block w-px h-7 bg-slate-200"
                                />

                                <motion.div variants={STAT_ITEM_VARIANTS}>
                                    <p className="text-xl sm:text-2xl font-semibold text-brand-600">Infinite</p>
                                    <p className="text-xs text-slate-500">Folder Nesting</p>
                                </motion.div>

                                <motion.div
                                    variants={SEPARATOR_VARIANTS}
                                    className="hidden sm:block w-px h-7 bg-slate-200"
                                />

                                <motion.div variants={STAT_ITEM_VARIANTS}>
                                    <p className="text-xl sm:text-2xl font-semibold text-brand-600">256-bit</p>
                                    <p className="text-xs text-slate-500">S3 Encryption</p>
                                </motion.div>

                                {/* Trust signal */}

                            </div>
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: -10 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                                }}
                                className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-center sm:justify-start"
                            >
                                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                                Powered by MongoDB & AWS S3.
                            </motion.div>

                        </div>

                        {/* Right Column: ProductMockup */}
                        <div
                            ref={mockupRef}
                            className={`w-full lg:w-6/12 mt-10 shrink-0 flex flex-col items-center ${isDesktop ? 'sticky-mockup-wrapper' : 'relative z-0'}`}
                            style={{
                                '--scroll': 0, // Default for SSR/Mobile
                                transformOrigin: 'top right'
                            }}
                        >
                            <style>{`
                                .sticky-mockup-wrapper {
                                    z-index: 10;
                                    width: calc(45% + (var(--scroll) * 25%));
                                    transform: translate(
                                        calc(-5% + (var(--scroll) * -150px)), 
                                        calc(var(--scroll) * 850px)
                                    );
                                    position: absolute;
                                    right: 0;
                                    top: 0;
                                    will-change: transform, width;
                                }
                            `}</style>

                            <div className={`relative w-full  flex items-center justify-center transition-all duration-300 ${isDesktop && showTaglines ? 'gap-8' : ''}`}>

                               

                                {/* Mockup Container */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className="relative w-full shrink-0"
                                >
                                    <div className="w-full relative z-10">
                                        <MemoizedProductMockup progress={sidebarExpanded ? 1 : 0} />
                                    </div>

                                    {/* Brand Watermark - Revealed behind mockup */}
                                    <motion.div
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-5] hidden lg:block pointer-events-none select-none"
                                        style={{
                                            opacity: 'clamp(0, (var(--scroll) - 0.5) * 2, 0.1)'
                                        }}
                                    >
                                        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-12deg)' }}>
                                            <text x="300" y="300" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="120" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-slate-900">
                                                CLOUD
                                            </text>
                                        </svg>
                                    </motion.div>

                                    {/* Glow Backdrop */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-500/[0.03] blur-[100px] -z-10 rounded-full" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-500/[0.02] blur-[120px] -z-20 rounded-full" />

                                    {/* Corner Glows */}
                                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-50/20 rounded-full blur-[60px] -z-10" />
                                    <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-50/15 rounded-full blur-[70px] -z-10" />
                                </motion.div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;