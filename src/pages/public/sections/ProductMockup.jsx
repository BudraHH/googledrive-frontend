import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Cloud,
    HardDrive,
    Users,
    Clock,
    Star,
    Trash2,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Menu,
    MoreVertical,
    Monitor,
    Plus,
    FileText,
    Image,
    Video,
    Music,
    Shield,
    Lock,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    RefreshCw,
    Folder
} from 'lucide-react';
import TitleBar from '@/components/ui/TitleBar';

const generalItems = [
    { label: 'My Drive', icon: HardDrive, active: true },
    { label: 'Computers', icon: Monitor },
    { label: 'Shared with me', icon: Users },
    { label: 'Recent', icon: Clock },
    { label: 'Starred', icon: Star },
    { label: 'Trash', icon: Trash2 },
];

const cloudItems = [
    { label: 'Backups', icon: Cloud },
    { label: 'Storage', icon: HardDrive },
];

const bottomItems = [
    { label: 'Settings', icon: Settings },
    { label: 'Help', icon: HelpCircle },
];

// Mock data
const stats = {
    storageUsed: "450 GB",
    totalFiles: "12.4k",
    devices: 3
};

const heatmapData = [2, 5, 8, 12, 15, 10, 8, 14, 7, 11, 4, 13, 10, 8];

const quickAccessFiles = [
    { id: 1, name: 'Project Proposal.pdf', type: 'PDF', size: '2.4 MB', modified: '2m ago' },
    { id: 2, name: 'Q4 Financials.xlsx', type: 'Sheet', size: '1.8 MB', modified: '5m ago' },
    { id: 3, name: 'Design Assets.zip', type: 'Archive', size: '154 MB', modified: '1h ago' },
];

const activities = [
    { id: 1, type: 'upload', title: 'Uploaded "Budget_2024.pdf"', detail: 'to Finance / Q1', time: '2m' },
    { id: 2, type: 'share', title: 'Shared "Marketing Assets"', detail: 'with Sarah & 3 others', time: '15m' },
    { id: 3, type: 'security', title: 'Security Scan Completed', detail: 'No threats detected', time: '1h' },
    { id: 4, type: 'upload', title: 'Uploaded "Site_Mockup.fig"', detail: 'to Projects / Website', time: '2h' },
    { id: 5, type: 'delete', title: 'Moved 3 files to Trash', detail: 'from Downloads', time: '4h' },
];

const storageDistribution = [
    { label: 'Documents', value: 45, color: 'bg-brand-500' },
    { label: 'Images', value: 30, color: 'bg-blue-500' },
    { label: 'Videos', value: 25, color: 'bg-slate-400' },
];

const securityStatus = {
    score: 98,
    checks: [
        { label: '256-bit Encryption', status: 'Active' },
        { label: 'Two-Factor Auth', status: 'Enabled' },
        { label: 'Auto-Backup', status: 'Synced' },
    ]
};

const getIcon = (type) => {
    switch (type) {
        case 'upload': return <Cloud className="w-[0.6em] h-[0.6em] text-brand-500" />;
        case 'share': return <Users className="w-[0.6em] h-[0.6em] text-blue-500" />;
        case 'security': return <Shield className="w-[0.6em] h-[0.6em] text-emerald-500" />;
        case 'delete': return <Trash2 className="w-[0.6em] h-[0.6em] text-red-500" />;
        default: return <FileText className="w-[0.6em] h-[0.6em] text-slate-400" />;
    }
};

const ProductMockup = ({ progress }) => {
    // Sidebar collapse state
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    // Track when layout animation is complete
    const [isSidebarReady, setIsSidebarReady] = useState(false);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    // Monitor width/scale changes to auto-collapse/expand sidebar
    // Monitor width/scale changes to auto-collapse/expand sidebar
    React.useEffect(() => {
        if (typeof progress === 'number') {
            // Logic for raw scroll progress (0 -> 1)
            // Expand sidebar when scrolled > 50%
            setIsSidebarCollapsed(progress < 0.5);
        } else if (typeof progress === 'string') {
            // Legacy/Fallback for string widths
            const numValue = parseFloat(progress);
            setIsSidebarCollapsed(numValue < 95);
        }
    }, [progress]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="relative w-full">
            {/* Main Window */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 overflow-hidden rounded-[0.8em] border border-white/40 bg-slate-50 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] text-[clamp(8px,1.2vw,14px)]"
            >
                {/* Browser Chrome */}
                <TitleBar variant="light" />

                {/* URL Bar */}
                <div className="flex border-y border-slate-200/60 bg-slate-50/80 gap-[0.5em] px-[0.5em] py-[0.3em]">
                    <div className="flex items-center gap-[0.4em]">
                        <ChevronLeft className="h-[0.8em] w-[0.8em] bg-slate-200 rounded-full p-[0.1em]" />
                        <ChevronRight className="h-[0.8em] w-[0.8em] bg-slate-200 rounded-full p-[0.1em]" />
                        <RefreshCw className="h-[0.8em] w-[0.8em] bg-slate-200 rounded-full p-[0.1em]" />
                    </div>
                    <div className="flex items-center rounded-sm w-full bg-white text-[0.7em] font-bold text-slate-400 gap-[0.5em] px-[0.8em] py-[0.3em]">
                        <Search className="w-[0.8em] h-[0.8em] text-brand-500" />
                        <span className="tracking-tight">clouddrive.com/my-drive</span>
                    </div>
                    <div className="flex items-center gap-[0.4em]">
                        <div className="h-[0.6em] w-[0.6em] rounded-full bg-slate-400/80"></div>
                        <Menu className="h-[0.6em] w-[0.6em]" />
                    </div>
                </div>

                {/* App Layout Container */}
                <div className="flex bg-slate-50 p-[0.5em] gap-[0.5em] aspect-[16/8]">
 
                </div>
            </motion.div>

            {/* Background Glow */}
            <div className="absolute -inset-10 -z-10 bg-brand-500/15 blur-[100px] rounded-full opacity-40"></div>
        </div>
    );
};

// Metric Card Component
function MetricCard({ title, value, label, icon, color }) {
    const variants = {
        brand: 'text-brand-600 bg-brand-50 border-brand-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        slate: 'text-slate-600 bg-slate-50 border-slate-100',
    };

    return (
        <div className="bg-white border border-slate-100 rounded-[0.4em] flex items-center p-[0.6em] gap-[0.5em]">
            <div className={`rounded-[0.3em] ${variants[color]} border shrink-0 p-[0.4em]`}>
                {React.cloneElement(icon, { className: 'h-[0.9em] w-[0.9em]' })}
            </div>
            <div className="min-w-0">
                <span className="text-[0.5em] font-black text-slate-400 uppercase tracking-widest block leading-none mb-[0.15em]">{title}</span>
                <div className="flex items-baseline gap-[0.25em]">
                    <h3 className="text-[1em] font-bold text-black leading-none">{value}</h3>
                    <span className="text-[0.4em] font-bold text-slate-400 uppercase">{label}</span>
                </div>
            </div>
        </div>
    );
}

export default ProductMockup;
