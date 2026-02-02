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
    Folder,
    ChevronDown,
    Home
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
                <div className="flex bg-slate-50 p-[0.3em] gap-[0.3em] aspect-[16/8] overflow-hidden text-[0.8em]">
                    {/* Sidebar Mockup */}
                    <aside className="w-[12em] bg-white rounded-[0.4em] flex flex-col border border-slate-200/60 shadow-sm shrink-0">
                        {/* Sidebar Logo */}
                        <div className="p-[0.8em] pb-[0.4em] flex items-center gap-[0.4em]">
                            <div className="h-[1.2em] w-[1.2em] rounded-[0.2em] bg-brand-950 flex items-center justify-center text-white">
                                <Cloud className="h-[0.7em] w-[0.7em]" fill="currentColor" />
                            </div>
                            <span className="font-bold text-[#082f49] text-[0.9em]">CloudDrive</span>
                        </div>

                        {/* New Button */}
                        <div className="px-[0.6em] py-[0.8em]">
                            <button className="flex items-center gap-[0.5em] px-[1em] py-[0.5em] bg-white border border-slate-200 rounded-full shadow-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-[0.8em]">
                                <Plus className="h-[1em] w-[1em] text-brand-500" strokeWidth={3} />
                                <span className="font-medium">New</span>
                            </button>
                        </div>

                        {/* Nav Items */}
                        <nav className="flex-1 px-[0.4em] space-y-[0.1em]">
                            <div className="px-[0.6em] py-[0.4em] text-white bg-brand-950 rounded-[0.2em] flex items-center gap-[0.6em] cursor-pointer">
                                <Home className="h-[1em] w-[1em]" />
                                <span className="font-medium">Home</span>
                            </div>
                            <div className="px-[0.6em] py-[0.4em] text-slate-600 hover:bg-slate-100 rounded-[0.2em] flex items-center gap-[0.6em] cursor-pointer">
                                <HardDrive className="h-[1em] w-[1em]" />
                                <span className="font-medium">My Drive</span>
                            </div>

                            <div className="h-[1em]"></div> {/* Spacer */}

                            <div className="px-[0.6em] py-[0.4em] text-slate-600 hover:bg-slate-100 rounded-[0.2em] flex items-center gap-[0.6em] cursor-pointer">
                                <Clock className="h-[1em] w-[1em]" />
                                <span className="font-medium">Recent</span>
                            </div>
                            <div className="px-[0.6em] py-[0.4em] text-slate-600 hover:bg-slate-100 rounded-[0.2em] flex items-center gap-[0.6em] cursor-pointer">
                                <Star className="h-[1em] w-[1em]" />
                                <span className="font-medium">Starred</span>
                            </div>

                            <div className="h-[1em]"></div> {/* Spacer */}

                            <div className="px-[0.6em] py-[0.4em] text-slate-600 hover:bg-slate-100 rounded-[0.2em] flex items-center gap-[0.6em] cursor-pointer">
                                <AlertTriangle className="h-[1em] w-[1em]" />
                                <span className="font-medium">Spam</span>
                            </div>
                            <div className="px-[0.6em] py-[0.4em] text-slate-600 hover:bg-slate-100 rounded-[0.2em] flex items-center gap-[0.6em] cursor-pointer">
                                <Trash2 className="h-[1em] w-[1em]" />
                                <span className="font-medium">Bin</span>
                            </div>
                        </nav>

                        {/* Sidebar Footer */}
                        <div className="p-[0.6em] border-t border-slate-100">
                            <div className="px-[0.6em] py-[0.4em] text-slate-400 flex items-center gap-[0.6em] cursor-pointer hover:text-slate-600">
                                <ChevronLeft className="h-[1em] w-[1em]" />
                                <span className="text-[0.9em]">Collapse</span>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Mockup */}
                    <div className="flex-1 bg-white rounded-[0.4em] border border-slate-200/60 shadow-sm flex flex-col overflow-hidden">
                        {/* Main Header */}
                        <header className="h-[3.2em] border-b border-slate-100 flex items-center justify-between px-[1.2em] shrink-0">
                            <div className="flex items-center gap-[0.4em] text-[0.85em]">
                                <span className="text-slate-400">Drive</span>
                                <ChevronRight className="h-[0.8em] w-[0.8em] text-slate-300" />
                                <div className="flex items-center gap-[0.2em] font-medium text-slate-700">
                                    <span>Home</span>
                                    <ChevronDown className="h-[1em] w-[1em] text-slate-400" />
                                </div>
                            </div>

                            <div className="flex items-center gap-[0.5em]">
                                <div className="flex items-center gap-[0.4em] px-[0.6em] py-[0.2em] hover:bg-slate-50 rounded-full cursor-pointer transition-colors">
                                    <div className="h-[1.6em] w-[1.6em] rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[0.7em] font-bold">
                                        AN
                                    </div>
                                    <span className="text-slate-700 font-medium text-[0.8em]">Alex Newman</span>
                                    <ChevronDown className="h-[0.8em] w-[0.8em] text-slate-400" />
                                </div>
                            </div>
                        </header>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto p-[1.5em] space-y-[1.5em] custom-scrollbar">
                            <h1 className="text-[1.4em] font-bold text-[#082f49] mb-[0.8em]">Welcome to CloudDrive.</h1>

                            {/* Suggested Folders Section */}
                            <section>
                                <div className="flex items-center gap-[0.4em] mb-[0.8em]">
                                    <ChevronDown className="h-[0.8em] w-[0.8em] text-slate-400" />
                                    <span className="font-semibold text-slate-500 text-[0.8em]">Suggested Folders</span>
                                    <span className="text-slate-300 text-[0.7em] font-medium">(6 of 13)</span>
                                </div>
                                <div className="grid grid-cols-4 gap-[0.8em]">
                                    {[
                                        "Project_Nebula_V2",
                                        "Brand Identity",
                                        "Client Research",
                                        "Financial Audit", 
                                    ].map((name, i) => (
                                        <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-[0.4em] p-[0.8em] hover:bg-slate-100/50 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-[0.4em] "><Folder className={`h-[1.2em] w-[1em] ${i === 0 ? 'text-brand-500' : 'text-slate-400'}`} />
                                            <p className="text-[0.85em] font-medium text-slate-700 truncate mb-[0.1em]">{name}</p></div>
                                            <p className="text-[0.65em] text-slate-400">My Drive</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-[0.8em] flex items-center gap-[0.2em] text-brand-600 font-bold text-[0.75em] cursor-pointer hover:underline pl-[1.2em]">
                                    <span>View more (6 more)</span>
                                    <ChevronDown className="h-[1em] w-[1em]" />
                                </div>
                            </section>

                            {/* Suggested Files Section */}
                            <section>
                                <div className="flex items-center justify-between mb-[0.8em]">
                                    <div className="flex items-center gap-[0.4em]">
                                        <ChevronDown className="h-[0.8em] w-[0.8em] text-slate-400" />
                                        <span className="font-semibold text-slate-500 text-[0.8em]">Suggested Files</span>
                                        <span className="text-slate-300 text-[0.7em] font-medium">(10 of 25)</span>
                                    </div>
                                    <div className="flex items-center bg-slate-100 rounded-[0.2em] p-[0.15em] border border-slate-200">
                                        <div className="p-[0.2em] bg-white rounded-[0.15em] shadow-sm">
                                            <Menu className="h-[0.8em] w-[0.8em] text-slate-600" />
                                        </div>
                                        <div className="p-[0.2em] ml-[0.1em]">
                                            <div className="grid grid-cols-2 gap-[0.1em]">
                                                <div className="w-[0.3em] h-[0.3em] bg-slate-400"></div>
                                                <div className="w-[0.3em] h-[0.3em] bg-slate-400"></div>
                                                <div className="w-[0.3em] h-[0.3em] bg-slate-400"></div>
                                                <div className="w-[0.3em] h-[0.3em] bg-slate-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-slate-100 rounded-[0.4em] overflow-hidden">
                                    <table className="w-full text-left text-[0.8em]">
                                        <thead className="bg-white border-b border-slate-100 text-slate-500 font-medium">
                                            <tr>
                                                <th className="py-[0.8em] px-[1em] font-semibold flex items-center gap-[0.4em]">
                                                    Name
                                                    <ArrowRight className="h-[0.8em] w-[0.8em] -rotate-90 text-brand-500" />
                                                </th>
                                                <th className="py-[0.8em] px-[1em] font-semibold">Owner</th>
                                                <th className="py-[0.8em] px-[1em] font-semibold">Original location</th>
                                                <th className="py-[0.8em] px-[1em]"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 bg-white">
                                            {[
                                                { name: "Final_Marketing_Plan_2025.pdf", initials: "MP", color: "bg-red-500" },
                                                { name: "Executive_Summary.pdf", initials: "ES", color: "bg-red-400" },
                                                { name: "Design_Specifications_v3.pdf", initials: "DS", color: "bg-red-400" },
                                                { name: "Q1_Product_Roadmap_Final.pdf", initials: "PR", color: "bg-red-500" },
                                                { name: "User_Interview_Notes.pdf", initials: "UI", color: "bg-red-400" },
                                                { name: "Infrastructure_Diagram.pdf", initials: "ID", color: "bg-red-400" },
                                                { name: "Asset_List_Approved.pdf", initials: "AL", color: "bg-red-400" },
                                                { name: "Technical_Documentation.pdf", initials: "TD", color: "bg-red-400" },
                                                { name: "Project_Timeline_Schedule.docx", initials: "TS", color: "bg-blue-500" },
                                                { name: "Legal_Agreement_Draft.pdf", initials: "LA", color: "bg-red-400" }
                                            ].map((file, i) => (
                                                <tr key={i} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                                    <td className="py-[0.6em] px-[1em] max-w-[20em]">
                                                        <div className="flex items-center gap-[0.6em]">
                                                            {file.name.endsWith('.pdf') ? (
                                                                <div className="p-[0.3em] bg-red-50 rounded-[0.2em]">
                                                                    <FileText className="h-[0.8em] w-[0.8em] text-red-500" />
                                                                </div>
                                                            ) : (
                                                                <div className="p-[0.3em] bg-blue-50 rounded-[0.2em]">
                                                                    <div className="h-[0.8em] w-[0.8em] bg-blue-500 rounded-[0.1em]" />
                                                                </div>
                                                            )}
                                                            <span className="text-slate-700 font-medium truncate">{file.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-[0.6em] px-[1em]">
                                                        <div className="flex items-center gap-[0.4em]">
                                                            <div className={`h-[1.4em] w-[1.4em] rounded-full flex items-center justify-center text-white text-[0.6em] font-bold ${i % 2 === 0 ? 'bg-[#082f49]' : 'bg-slate-500'}`}>
                                                                {file.initials}
                                                            </div>
                                                            <span className="text-slate-500 text-[0.9em]">me</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-[0.6em] px-[1em]">
                                                        <div className="flex items-center gap-[0.4em] text-slate-400">
                                                            <Folder className="h-[0.8em] w-[0.8em]" />
                                                            <span className="text-[0.9em]">{i === 1 ? 'My Drive' : 'Folder'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-[0.6em] px-[1em] text-right">
                                                        <MoreVertical className="h-[1em] w-[1em] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-[0.8em] flex items-center gap-[0.2em] text-brand-600 font-bold text-[0.75em] cursor-pointer hover:underline pl-[0.5em]">
                                    <span>View more (15 more files)</span>
                                    <ChevronDown className="h-[1em] w-[1em]" />
                                </div>
                            </section>
                        </div>
                    </div>
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
