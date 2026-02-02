// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/routes/routes';
import useAuthStore from '@/stores/useAuthStore';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState({ email: '', password: '' });

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!formData.email) {
            newErrors.email = 'Email Address (Username) is required';
            isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Must be a valid email address';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError('');
        setIsLoading(true);

        try {
            const user = await login({
                email: formData.email,
                password: formData.password,
            });

            toast.success(`Welcome back, ${user.firstName}!`);

            if (user.role === 'admin' || user.role === 'super-admin') {
                navigate(ROUTES.PROTECTED.ADMIN.DASHBOARD);
            } else {
                navigate(ROUTES.PROTECTED.USER.DASHBOARD);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans relative p-4 sm:p-8 md:p-12 lg:p-24 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col lg:flex-row w-full bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px] lg:h-[calc(100vh-12rem)]"
            >
                {/* Left Side Panel */}
                <div className="w-2/3 hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-brand-950 via-brand-950 to-brand-950 text-white relative overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl pointer-events-none"
                    />
                    <Link to={ROUTES.PUBLIC.HOME} className="absolute top-16 left-16 inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform mr-4" />
                        Back to Home
                    </Link>
                    <div className="relative z-10 w-full ">
                        <p className="text-brand-200 text-xl font-medium mb-4">Secure Cloud Access</p>
                        <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight w-full mb-4">
                            Access your files <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-100 to-brand-200">anywhere.</span>
                        </h1>
                        <div className="h-1 w-16 bg-gradient-to-r from-white/80 to-white/20 rounded-full origin-left mb-4" />
                        <p className="text-brand-100 text-lg leading-relaxed max-w-md">
                            See your files from any computer without downloading an app.
                        </p>

                    </div>
                </div>

                {/* Right Side - Form Section */}
                <div className="w-full lg:w-1/3 flex flex-col justify-center items-center bg-white p-6 sm:p-12 lg:p-14 flex-1">
                    <div className="w-full max-w-lg mx-auto">
                        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
                        <p className="text-slate-500 text-sm mb-8">Enter your credentials to access your drive.</p>

                        {error && (
                            <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-4 p-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Email Address</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={formErrors.email ? "border-red-500" : ""}
                                />
                                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-slate-700 font-semibold">Password</Label>
                                    <Link to={ROUTES.PUBLIC.FORGOT_PASSWORD} className="text-xs font-medium text-brand-600 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={formErrors.password ? "border-red-500" : ""}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
                            </div>

                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <div className="h-[18px] w-[18px] rounded border border-slate-300 bg-white peer-checked:bg-brand-500 flex items-center justify-center">
                                    <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className="text-sm text-slate-600 ml-4">Remember me</span>
                            </label>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                            </Button>
                        </form>

                        <p className="text-center text-slate-500 text-sm mt-4">
                            Don't have an account?{' '}
                            <Link to={ROUTES.PUBLIC.SIGNUP} className="text-brand-900 font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}