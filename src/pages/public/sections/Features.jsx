import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cloud, Server, Lock, Sparkles, ChevronRight, LayoutDashboard, Key, Globe, FolderPlus } from 'lucide-react';

const values = [
    {
        icon: Shield,
        title: "Secure Authentication",
        tagline: "2-Step Activation Workflow",
        description: "Secure registration with email verification. Users must activate their account via a magic link sent to their inbox before accessing the platform.",
        detail: "We use 256-bit encryption for passwords and ensure unique identities for every user. Access is strictly controlled via our 2-step verification process.",
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-50 to-teal-100",
        metric: "2-Step",
        metricLabel: "Verification"
    },
    {
        icon: Cloud,
        title: "AWS S3 Powered",
        tagline: "Private Bucket Storage",
        description: "Your files are stored safely in private AWS S3 buckets. We ensure that only the owner has access to view or download their content.",
        detail: "Leveraging the power of Amazon Web Services for industry-leading durability and availability, while maintaining strict privacy controls.",
        gradient: "from-orange-500 to-amber-500",
        bgGradient: "from-orange-50 to-amber-100",
        metric: "S3",
        metricLabel: "Integrated"
    },
    {
        icon: LayoutDashboard,
        title: "Smart Dashboard",
        tagline: "Visual File Management",
        description: "A comprehensive dashboard to manage your files and folders. View creation timestamps and organize your digital workspace efficiently.",
        detail: "Create new folders with a single click and navigate through your directory structure seamlessly.",
        gradient: "from-blue-600 to-indigo-600",
        bgGradient: "from-blue-50 to-indigo-100",
        metric: "Real-time",
        metricLabel: "Updates"
    },
    {
        icon: Server,
        title: "MongoDB Atlas",
        tagline: "Metadata Architecture",
        description: "We use MongoDB Atlas to store complex metadata, including folder paths and file information, ensuring rapid retrieval.",
        detail: "A robust backend architecture that links your S3 objects with rich metadata for a complete file system experience.",
        gradient: "from-green-600 to-emerald-600",
        bgGradient: "from-green-50 to-emerald-100",
        metric: "NoSQL",
        metricLabel: "Database"
    }
];

const Features = () => {
    const featuresRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!featuresRef.current) return;
            const rect = featuresRef.current.getBoundingClientRect();
            const scrollableDistance = rect.height - window.innerHeight;

            if (scrollableDistance <= 0) return;

            const scrolled = -rect.top;
            const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

            const newIndex = Math.min(
                values.length - 1,
                Math.floor(progress * values.length)
            );
            setActiveIndex(newIndex);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const featuredValue = values[activeIndex];
    const nextValues = [...values.slice(activeIndex + 1), ...values.slice(0, activeIndex)].slice(0, 2);

    return (
        <section id="features"
            ref={featuresRef}
            className="relative h-auto lg:h-[300vh] bg-slate-50">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative lg:sticky top-0 h-auto lg:h-screen flex flex-col justify-center py-10 md:py-16 lg:py-0 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 py-2 mb-2"
                    >
                        <div className="w-10 md:w-16 h-0.5 bg-brand-500" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-700">Problem Statement</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-2 md:mb-3"
                    >
                        Engineered for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
                            Modern Cloud Architecture.
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-sm md:text-lg text-slate-500 leading-relaxed max-w-2xl mb-6 md:mb-10"
                    >
                        A full-stack solution integrating AWS S3, MongoDB Atlas, and Node.js for a seamless Google Drive experience.
                    </motion.p>

                    <div className="lg:hidden space-y-2">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white rounded-lg border border-slate-200 p-3 flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white shrink-0`}>
                                    <value.icon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-slate-900 truncate">{value.title}</h3>
                                    <p className="text-[11px] text-slate-400 truncate">{value.tagline}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className={`text-base font-bold text-transparent bg-clip-text bg-gradient-to-r ${value.gradient}`}>
                                        {value.metric}
                                    </div>
                                    <div className="text-[8px] font-mono uppercase text-slate-400">
                                        {value.metricLabel}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Layout: Featured + Next 2 */}
                    <div className="hidden lg:grid grid-cols-12 gap-8 items-center">

                        {/* Featured Value - Large Card */}
                        <div className="col-span-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 30 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative bg-white rounded-2xl border border-slate-200 p-8 lg:p-10 overflow-hidden"
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${featuredValue.bgGradient} opacity-50`} />

                                    <div className="relative grid lg:grid-cols-5 gap-8 items-center">
                                        {/* Content */}
                                        <div className="col-span-3">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${featuredValue.gradient} text-white text-xs font-semibold mb-5 shadow-lg`}>
                                                <Sparkles size={12} />
                                                Feature {String(activeIndex + 1).padStart(2, '0')}
                                            </div>

                                            <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                                                {featuredValue.title}
                                            </h3>

                                            <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                                                {featuredValue.description}
                                            </p>

                                            <p className="text-slate-500 leading-relaxed mb-6">
                                                {featuredValue.detail}
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${featuredValue.gradient}`}>
                                                    {featuredValue.metric}
                                                </div>
                                                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                                                    {featuredValue.metricLabel}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Element */}
                                        <div className="col-span-2 relative flex items-center justify-center">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                                className="absolute w-48 h-48 rounded-full border-2 border-dashed border-slate-200/50"
                                            />
                                            <motion.div
                                                animate={{ rotate: -360 }}
                                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                                className="absolute w-36 h-36 rounded-full border border-slate-300/30"
                                            />
                                            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${featuredValue.gradient} flex items-center justify-center shadow-2xl`}>
                                                <featuredValue.icon size={40} className="text-white" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Progress Indicator */}
                            <div className="mt-6 flex items-center gap-2">
                                {values.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex
                                            ? `flex-1 bg-gradient-to-r ${values[activeIndex].gradient}`
                                            : 'w-1.5 bg-slate-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Next 2 Values - Preview Cards */}
                        <div className="col-span-4 space-y-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Up Next</p>

                            {nextValues.map((value, index) => (
                                <motion.div
                                    key={`${activeIndex}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                                            <value.icon size={20} strokeWidth={2} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 mb-1 text-sm">
                                                {value.title}
                                            </h4>
                                            <p className="text-xs text-slate-400 italic">
                                                {value.tagline}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${value.gradient}`}>
                                                {value.metric}
                                            </div>
                                            <div className="text-[9px] font-mono uppercase text-slate-400">
                                                {value.metricLabel}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="flex items-center justify-center gap-2 pt-2 text-slate-400">
                                <span className="text-xs font-medium">Scroll to explore</span>
                                <ChevronRight size={14} className="animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
