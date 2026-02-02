import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, ArrowLeft, ShieldAlert, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ROUTES } from '@/routes/routes';
import useAuthStore from '@/stores/useAuthStore';

export default function UnauthorizedPage() {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">
                {/* Logo */}
                <div className="flex flex-col items-center gap-4 mb-12">
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-red-600 text-white shadow-lg">
                        <Cloud size={28} fill="currentColor" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                        CloudDrive
                    </span>
                </div>

                {/* Secure Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-red-50 p-4 rounded-full border border-red-100">
                        <ShieldAlert size={48} className="text-red-600" />
                    </div>
                </div>

                {/* Error Info */}
                <div className="space-y-4 mb-10">
                    <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
                    <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                        You don't have permission to access this page.
                        {user && <span className="block mt-2 font-medium text-slate-700 italic">Account: {user.email}</span>}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        as={Link}
                        to={ROUTES.PROTECTED.USER.DASHBOARD}
                        className="w-full h-12 rounded bg-brand-950 hover:bg-slate-900 text-white font-semibold shadow-sm"
                    >
                        Return to Dashboard
                    </Button>
                    <Button
                        onClick={() => logout()}
                        variant="ghost"
                        className="w-full h-12 rounded text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                    >
                        <LogOut size={18} className="mr-2" />
                        Sign Out
                    </Button>
                </div>

                {/* Footer */}
                <p className="mt-16 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    Security Error: 403_FORBIDDEN
                </p>
            </div>
        </div>
    );
}
