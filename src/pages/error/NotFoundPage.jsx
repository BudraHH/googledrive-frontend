import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ROUTES } from '@/routes/routes';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">
                {/* Logo */}
                <div className="flex flex-col items-center gap-4 mb-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-brand-950 text-white shadow-lg">
                        <Cloud size={28} fill="currentColor" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-brand-950">
                        CloudDrive
                    </span>
                </div>

                {/* Error Info */}
                <div className="space-y-4 mb-10">
                    <div className="text-6xl font-black text-slate-200">404</div>
                    <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
                    <p className="text-slate-500 leading-relaxed">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        as={Link}
                        to={ROUTES.PROTECTED.USER.DASHBOARD}
                        className="w-full h-12 rounded bg-brand-950 hover:bg-slate-900 text-white font-semibold shadow-sm"
                    >
                        <Home size={18} className="mr-2" />
                        Go to Home
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        className="w-full h-12 rounded text-slate-600 hover:bg-slate-100 font-medium"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Go Back
                    </Button>
                </div>

                {/* Footer */}
                <p className="mt-16 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Error Code: 404_NOT_FOUND
                </p>
            </div>
        </div>
    );
}
