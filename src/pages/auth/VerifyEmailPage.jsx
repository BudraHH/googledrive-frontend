// src/pages/auth/VerifyEmailPage.jsx
import { useState, useEffect, useRef } from 'react';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowLeft, ShieldCheck, CheckCircle, Lock } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { Button } from "@/components/ui/button";

import authService from '@/services/authService';

export default function VerifyEmailPage() {
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    useEffect(() => {
        if (!token || hasVerified.current) return;

        const verifyEmail = async () => {
            hasVerified.current = true;

            try {
                await authService.activate(token);
                setStatus('success');
                setTimeout(() => {
                    navigate(ROUTES.PUBLIC.LOGIN);
                }, 3000);
            } catch (err) {
                // If we got a 400 but it was because of a double-fire, 
                // we'll just ignore it if the status is already success.
                // But status update is async, so we use a more direct check.
                setStatus('error');
                setError(err.response?.data?.message || 'Verification failed. Link may be expired or invalid.');
            }
        };

        verifyEmail();
    }, [token, navigate]);



    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans relative p-4 sm:p-8 md:p-12 lg:p-24 overflow-y-auto">
            {/* Dark mode ambient glow */}
            <div className="hidden absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="hidden absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] lg:h-[calc(100vh-12rem)]"
            >
                {/* Brand Panel */}
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
                                Email Verification
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
                            >
                                Confirming <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-100 to-brand-200">your identity.</span>
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
                                Verifying your email ensures a secure experience and unlocks all features.
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
                                <span className="text-slate-300 font-medium">One-time verification</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-brand-400" size={20} />
                                <span className="text-slate-300 font-medium">Quick & Secure</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Content Panel */}
                <div className="w-full lg:w-1/3 bg-white p-10 lg:p-14 flex flex-col justify-center items-center text-center">
                    <div className="w-full max-w-md mx-auto">

                        {/* Loading State */}
                        {status === 'loading' && (
                            <div className="animate-in fade-in duration-500">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
                                    <Loader2 className="h-8 w-8 animate-spin text-brand-600 " />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying your email...</h2>
                                <p className="text-slate-500 text-sm">Please wait while we confirm your address.</p>
                            </div>
                        )}

                        {/* Success State */}
                        {status === 'success' && (
                            <div className="animate-in zoom-in-95 duration-500">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="h-8 w-8 text-green-600 " />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    Your email has been successfully verified. You can now access all features.
                                </p>

                                <div className="rounded-xl bg-slate-50 text-sm text-slate-500 w-full border border-slate-100 p-4 mb-6">
                                    Redirecting to login page in 3 seconds...
                                </div>

                                <Link to={ROUTES.PUBLIC.LOGIN} className="w-full block">
                                    <Button className="w-full h-11 font-semibold shadow-lg shadow-brand-500/20">
                                        Continue to Login
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Error State */}
                        {status === 'error' && (
                            <div className="animate-in slide-in-from-top-4 duration-500">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                                    <XCircle className="h-8 w-8 text-red-500 " />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
                                <p className="text-slate-500 text-sm mb-6">{error}</p>

                                <div className="w-full rounded-xl bg-red-50 border border-red-100 text-left p-6 mb-8">
                                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">Possible reasons:</p>
                                    <ul className="text-sm text-red-600/80 list-disc list-inside space-y-2">
                                        <li>The verification link has expired</li>
                                        <li>The link has already been used</li>
                                        <li>The link is invalid or incomplete</li>
                                    </ul>
                                </div>

                                <div className="w-full space-y-3">
                                    <Link to={ROUTES.PUBLIC.SIGNUP} className="w-full block">
                                        <Button className="w-full h-11 font-semibold">
                                            <Mail className="h-4 w-4 mr-2" />
                                            Resend Verification Email
                                        </Button>
                                    </Link>
                                    <Link to={ROUTES.PUBLIC.LOGIN} className="w-full block">
                                        <Button variant="outline" className="w-full h-11 font-semibold border-slate-200">
                                            Back to Login
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </motion.div>
        </div>
    );
}
