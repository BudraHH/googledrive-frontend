import React from 'react';
import { motion } from 'framer-motion';

const ActivationStep = () => {
    const steps = [
        {
            id: '01',
            title: "Create Account",
            description: "Sign up instantly with your email. No credit card required for the free tier."
        },
        {
            id: '02',
            title: "Verify Identity",
            description: "Click the secure magic link sent to your inbox to validate your session."
        },
        {
            id: '03',
            title: "Key Generation",
            description: "We automatically generate your private 256-bit encryption keys locally."
        },
        {
            id: '04',
            title: "Start Syncing",
            description: "Drag and drop your files. Everything is encrypted before it leaves your device."
        }
    ];

    return (
        <section id="how-it-works" className="relative py-24 lg:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Section Header */}
                <div className="text-left max-w-2xl mb-16 px-0 lg:mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 py-2 mb-2"
                    >
                        <div className="w-10 md:w-16 h-0.5 bg-brand-600" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-700">How It Works</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6"
                    >
                        Continuous Security. <br />
                        <span className="text-slate-400">Zero Friction.</span>
                    </motion.h2>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative flex flex-col justify-between h-[340px] p-8 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 hover:border-brand-100/50 hover:bg-white hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.05)] transition-all duration-500 ease-out overflow-hidden transform hover:-translate-y-1"
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 via-transparent to-brand-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <span className="inline-block text-sm font-bold text-slate-400 mb-6 font-mono px-2 py-1 rounded-md bg-slate-100 border border-slate-200 group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-100 transition-colors duration-300">
                                    {step.id}
                                </span>
                                <h3 className="text-3xl font-bold text-slate-900 leading-[1.1] tracking-tight group-hover:text-black transition-colors">
                                    {step.title.split(' ').map((word, i) => (
                                        <span key={i} className="block">{word}</span>
                                    ))}
                                </h3>
                            </div>

                            <div className="relative z-10">
                                <div className="w-8 h-[1px] bg-slate-200 mb-6 group-hover:w-full group-hover:bg-brand-200 transition-all duration-500" />
                                <p className="text-[0.9rem] font-medium text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ActivationStep;
