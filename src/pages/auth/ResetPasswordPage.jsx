// src/pages/auth/ResetPasswordPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Eye, EyeOff, Check, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import authService from '@/services/authService';

export default function ResetPasswordPage() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form State
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams(); // Start with empty if no router logic yet
    const navigate = useNavigate();

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { strength: 0, text: '', color: '', barColor: '' };
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

        if (strength <= 2) return { strength, text: 'Weak', color: 'text-red-500', barColor: 'bg-red-500' };
        if (strength <= 3) return { strength, text: 'Medium', color: 'text-yellow-500', barColor: 'bg-yellow-500' };
        return { strength, text: 'Strong', color: 'text-green-500', barColor: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(password);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate(ROUTES.PUBLIC.LOGIN);
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
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
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-8 w-8 text-green-600 " />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Password Reset!</h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Your password has been changed successfully. You can now login with your new credentials.
                    </p>

                    <div className="rounded-xl bg-slate-50 text-sm text-slate-500 w-full border border-slate-100 p-4 mb-6">
                        Redirecting to login page in 3 seconds...
                    </div>

                    <Link to={ROUTES.PUBLIC.LOGIN} className="w-full">
                        <Button className="w-full h-11 font-semibold">
                            Continue to Login
                        </Button>
                    </Link>
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
                                Secure Access
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
                            >
                                Create a new <br />
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
                                Choose a strong, unique password to keep your account secure.
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
                                <ShieldCheck className="text-brand-400" size={20} />
                                <span className="text-slate-300 font-medium">Strong Encryption</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Lock className="text-brand-400" size={20} />
                                <span className="text-slate-300 font-medium">Secure Storage</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Content Panel */}
                <div className="w-full lg:w-1/3 bg-white p-10 lg:p-14 flex flex-col justify-center items-center">
                    <div className="w-full max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Set new password</h2>
                            <p className="text-slate-500 text-sm">
                                Your new password must be different from previously used passwords.
                            </p>
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-6 p-4"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">New Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {password && (
                                    <div className="space-y-3 mt-3">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-300 ${passwordStrength.barColor}`} style={{ width: `${(passwordStrength.strength / 5) * 100}%` }} />
                                            </div>
                                            <span className={`text-xs font-semibold ${passwordStrength.color}`}>{passwordStrength.text}</span>
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <div className={password.length >= 8 ? 'text-green-500 flex items-center gap-2' : 'text-slate-400 flex items-center gap-2'}>
                                                {password.length >= 8 ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-current"></div>} At least 8 characters
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                disabled={isLoading}
                                className="w-full h-12"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Resetting...
                                    </>
                                ) : "Reset Password"}
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
