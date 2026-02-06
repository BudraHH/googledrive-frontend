// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles, Mail, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import authService from '@/services/authService';

export default function ForgotPasswordPage() {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setError('Invalid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    if (success) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans relative p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center justify-center w-full max-w-md bg-white rounded-2xl shadow-2xl text-center p-8"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                        <Mail className="h-8 w-8 text-green-600 " />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Once the user email address is valid, a secure token has been sent to your email.
                    </p>

                    <Link to={ROUTES.PUBLIC.LOGIN} className="w-full">
                        <Button variant="outline" className="w-full h-11 font-semibold text-slate-700 border-slate-200 ">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                        </Button>
                    </Link>

                    <p className="mt-6 text-sm text-slate-400 ">
                        Didn't receive it?{' '}
                        <button
                            onClick={() => setSuccess(false)}
                            className="font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2"
                        >
                            Try again
                        </button>
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans relative p-4 sm:p-8 md:p-12 lg:p-24 overflow-y-auto">
            {/* Dark mode ambient glow */}
            <div className="hidden absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="hidden absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[500px] lg:h-[calc(100vh-12rem)]"
            >
                {/* Brand Panel - Left */}
                <div className="w-full lg:w-2/3 bg-gradient-to-br from-brand-950 via-brand-950 to-brand-950 p-16 flex flex-col justify-between text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '28px 28px'
                        }}
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none"
                    />

                    <div className="relative z-10">
                        <Link to={ROUTES.PUBLIC.LOGIN} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>

                        <div className="mt-16">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-brand-200 font-medium tracking-wide text-xl mb-4"
                            >
                                Recover Access
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
                            >
                                Reset your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-100 to-brand-200">password.</span>
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="h-1 w-16 bg-gradient-to-r from-white/80 to-white/20 rounded-full origin-left mb-6"
                            />
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-brand-100 text-lg leading-relaxed max-w-md"
                            >
                                Enter your email address and we'll send you a secure link to reset your password.
                            </motion.p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="relative z-10 pt-12 border-t border-white/10 mt-auto"
                    >
                        <div className="flex gap-8">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-brand-400" size={20} />
                                <span className="text-slate-300 font-medium">Secure Link</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-brand-400" size={20} />
                                <span className="text-slate-300 font-medium">Expires in 1 hour</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Content Panel - Right */}
                <div className="w-full lg:w-1/3 bg-white p-10 lg:p-14 flex flex-col justify-center items-center">
                    <div className="w-full max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-10"
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
                            <p className="text-slate-500">No worries. Enter your email below.</p>
                        </motion.div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {error && <p className="text-xs text-red-500">{error}</p>}
                            </div>

                            <Button
                                disabled={isLoading}
                                className="w-full h-11"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : "Send Reset Link"}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 text-sm">
                                Remember your password?{' '}
                                <Link to={ROUTES.PUBLIC.LOGIN} className="text-brand-900 hover:underline font-bold hover:text-brand-800 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
