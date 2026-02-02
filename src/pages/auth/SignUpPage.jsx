// src/pages/auth/SignUpPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '@/routes/routes';

import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import useAuthStore from '@/stores/useAuthStore';
import { toast } from 'react-toastify';

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);


    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [formErrors, setFormErrors] = useState({ firstName: '', lastName: '', email: '', password: '' });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { firstName: '', lastName: '', email: '', password: '' };

        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email Address is required';
            isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Must be a valid email address';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
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

        setIsLoading(true);

        try {
            const data = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

            toast.success(data.message || 'Registration successful! Please check your email.');
            // We don't navigate to dashboard because account is inactive
            navigate(ROUTES.PUBLIC.LOGIN);

        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Registration failed');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };



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
                {/* Brand Panel - On Left for Desktop (Matching Login Page) */}
                <div className="w-full lg:w-2/3 bg-gradient-to-br from-brand-950 via-brand-950 to-brand-950 p-16 flex flex-col justify-between text-white overflow-hidden relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '28px 28px'
                        }}
                    />

                    {/* Glow Effects */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"
                    />

                    {/* Top Content */}
                    <div className="relative z-10">
                        <Link to={ROUTES.PUBLIC.HOME} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <div className="mt-16">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-brand-200 font-medium tracking-wide text-xl mb-4"
                            >
                                Secure Cloud Storage
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6"
                            >
                                Access your files <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-100 to-brand-200">anywhere.</span>
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
                                See your files from any computer without downloading an app.
                            </motion.p>
                        </div>

                    </div>

                    {/* Bottom Stats/Features */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="relative z-10 pt-12 border-t border-white/10 mt-auto"
                    >
                        <div className="flex gap-8">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-brand-400" size={20} />
                                <span className="text-slate-300 font-medium">End-to-end encryption</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-brand-400" size={20} />
                                <span className="text-slate-300 font-medium">Global CDN</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-brand-400" size={20} />
                                <span className="text-slate-300 font-medium">Seamless collaboration</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/3 bg-white p-10 lg:p-14 flex flex-col justify-center items-center">
                    <div className="w-full max-w-md mx-auto">

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-10"
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                            <p className="text-slate-500">Sign up for free to get started.</p>
                        </motion.div>

                        <form onSubmit={onSubmit} className="space-y-5">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-slate-700 font-semibold">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={formErrors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {formErrors.firstName && <p className="text-xs text-red-500">{formErrors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-slate-700 font-semibold">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={formErrors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}
                                    />
                                    {formErrors.lastName && <p className="text-xs text-red-500">{formErrors.lastName}</p>}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={formErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="password" classname="text-slate-700 font-semibold">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`pr-10 ${formErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400  hover:text-slate-600  transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {formErrors.password ? (
                                    <p className="text-xs text-red-500">{formErrors.password}</p>
                                ) : (
                                    <p className="text-xs text-slate-500">Must be at least 8 characters.</p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button
                                    disabled={isLoading}
                                    className="w-full"
                                    size="md"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Creating...
                                        </>
                                    ) : "Create Account"}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-slate-500 text-sm">
                                Already have an account?{' '}
                                <Link to={ROUTES.PUBLIC.LOGIN} className="text-brand-900 hover:underline font-bold hover:text-brand-800 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
