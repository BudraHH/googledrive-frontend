import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { filesAPI } from '@/services/api/filesAPI';
import {
    Plus,
    Home,
    HardDrive,
    Users,
    Clock,
    Star,
    CircleAlert,
    Trash2,
    Cloud,
    Briefcase,
    FileText,
    Bell,
    Settings,
    HelpCircle,
    LogOut,
    User,
    Menu,
    LayoutDashboard,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Zap,
    Monitor,
    BookOpen,
    GraduationCap,
    Code,
    Award,
    Trophy,
    SparklesIcon,
    FileIcon,
    FolderPlus,
    FileUp,
    FolderUp
} from 'lucide-react';
import useAuthStore from '@/stores/useAuthStore';
import { ROUTES } from '@/routes/routes';
import { DATA_TYPES } from '@/constants/appConstants';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import MoreButtonMenu from '@/components/shared/MoreButtonMenu';
import NewButtonMenu from '@/components/shared/NewButtonMenu';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { useNotificationStore } from '@/stores/notificationStore';
import { useAgentStore } from '@/stores/agentStore';
import { AgentStatusIndicator } from '@/components/agent/AgentStatusIndicator';
import { userAPI } from '@/services/api/userAPI';
import { PROFILE_STEPS } from '@/constants/profileSteps';
import NewFolderDialog from '@/components/shared/NewFolderDialog';
import FileUploadDialog from '@/components/shared/FileUploadDialog';
import FolderUploadDialog from '@/components/shared/FolderUploadDialog';
import { useFileUpload } from '@/hooks/useFileUpload';
import { UploadCloud } from 'lucide-react'; // Import for Drag Overlay icon
import FilePreviewModal from '@/components/shared/FilePreviewModal';
import UploadProgressWidget from '@/components/shared/UploadProgressWidget';
import ActionFeedback from '@/components/shared/ActionFeedback';
import { useActionStore } from '@/stores/actionStore';


export default function ProtectedLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [profileSubMenuOpen, setProfileSubMenuOpen] = useState(false);
    const { isSidebarCollapsed, toggleSidebar } = useAuthStore();
    const { unreadCount, fetchUnreadCount, connect, disconnect } = useNotificationStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user, updateUser } = useAuthStore();
    const { toast } = useToast();
    const userMenuRef = useRef(null);
    const newButtonRef = useRef(null);
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const { isDragging, dragProps, handleUpload } = useFileUpload();

    const [isRestoring, setIsRestoring] = useState(false);
    const [showNewButtonMenu, setShowNewButtonMenu] = useState(false);
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
    const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
    const [isFolderUploadDialogOpen, setIsFolderUploadDialogOpen] = useState(false);

    const params = useParams();

    const getCurrentFolderId = () => {
        const match = location.pathname.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    const handleCreateFolder = async (name) => {
        const { startAction, endAction } = useActionStore.getState();
        startAction("Working...");
        try {
            const parentId = getCurrentFolderId();
            await filesAPI.createFolder(name, parentId);
            endAction();

            toast({
                title: "Folder created",
                description: `"${name}" has been created successfully.`
            });
            window.dispatchEvent(new Event('refresh-files'));
        } catch (error) {
            endAction();
            console.error("Failed to create folder:", error);
            toast({
                title: "Error",
                description: "Failed to create folder.",
                variant: "destructive"
            });
        }
    };

    const PROFILE_SETUP_STEPS = PROFILE_STEPS;

    const isOnProfileSetup = ROUTES.PROTECTED.USER.PROFILE_SETUP?.BASE && location.pathname.startsWith(ROUTES.PROTECTED.USER.PROFILE_SETUP.BASE);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
            if (newButtonRef.current && !newButtonRef.current.contains(event.target)) {
                setShowNewButtonMenu(false);
            }
            if (newButtonRef.current && !newButtonRef.current.contains(event.target)) {
                setShowNewButtonMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        connect();

        useAgentStore.getState().startPolling();

        return () => {
            disconnect();
            useAgentStore.getState().stopPolling();
        };
    }, [fetchUnreadCount, connect, disconnect]);

    useEffect(() => {
        fetchUnreadCount();
    }, [location.pathname, fetchUnreadCount]);

    useEffect(() => {
        if (isOnProfileSetup) {
            setProfileSubMenuOpen(true);
        }
    }, [isOnProfileSetup]);

    const handleRestore = async () => {
        setIsRestoring(true);
        try {
            await userAPI.restoreAccount();
            const freshUser = await userAPI.getProfile();
            const userData = freshUser?.data || freshUser;
            updateUser({ ...userData, deleted_at: null, is_active: true });
            toast({
                title: "Account Restored!",
                description: "Welcome back! Your account and all data have been restored."
            });
        } catch (error) {
            console.error("Restoration failed:", error);
            toast({
                title: "Error",
                description: "Failed to restore account. Please contact support.",
                variant: "destructive"
            });
        } finally {
            setIsRestoring(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate(ROUTES.PUBLIC.LOGIN);
    };

    const generalItems = [
        {
            label: 'Home',
            icon: Home,
            path: ROUTES.PROTECTED.USER.DASHBOARD,
        },
        {
            label: 'My Drive',
            icon: HardDrive,
            path: ROUTES.PROTECTED.USER.MY_DRIVE,
        },
    ];

    const middleItems = [
        {
            label: 'Recent',
            icon: Clock,
            path: ROUTES.PROTECTED.USER.RECENT,
        },
        {
            label: 'Starred',
            icon: Star,
            path: ROUTES.PROTECTED.USER.STARRED,
        },
    ];

    const bottomDriveItems = [
        {
            label: 'Spam',
            icon: CircleAlert,
            path: ROUTES.PROTECTED.USER.SPAM,
        },
        {
            label: 'Bin',
            icon: Trash2,
            path: ROUTES.PROTECTED.USER.BIN,
        },
    ];

    const navItems = [...generalItems, ...middleItems, ...bottomDriveItems];

    const isActive = (path) => {
        if (!path) return false;
        if (path === ROUTES.PROTECTED.USER.DASHBOARD && location.pathname === ROUTES.PROTECTED.USER.OPTIMIZATION) {
            return true;
        }

        if (path === ROUTES.PROTECTED.USER.PROFILE_SETUP?.BASE ||
            path === ROUTES.PROTECTED.USER.SETTINGS?.BASE ||
            path === ROUTES.PROTECTED.USER.MY_AGENTS ||
            path === ROUTES.PROTECTED.USER.JOBS ||
            path === ROUTES.PROTECTED.USER.HELP?.BASE) {
            return location.pathname.startsWith(path);
        }
        return location.pathname === path;
    };

    const [breadcrumbPath, setBreadcrumbPath] = useState([]);

    const fetchPath = async (folderId) => {
        let path = [];
        let currentId = folderId;
        const maxDepth = 10;
        let depth = 0;

        while (currentId && depth < maxDepth) {
            try {
                const item = await filesAPI.getItem(currentId);
                path.unshift({
                    ...item,
                    name: item.name,
                    id: item.id || item._id,
                    parent_id: item.parent_id
                });
                currentId = item.parent_id;
            } catch (err) {
                console.error(`Failed to fetch ancestor ${currentId}`, err);
                break;
            }
            depth++;
        }
        return path;
    };

    useEffect(() => {
        const match = location.pathname.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            const folderId = match[1];
            setBreadcrumbPath([]);

            fetchPath(folderId).then(fullPath => {
                setBreadcrumbPath(fullPath);
            });
        } else {
            setBreadcrumbPath([]);
        }
    }, [location.pathname]);

    const getBreadcrumbSegments = () => {
        const segments = [];

        const match = location.pathname.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
        if (match) {
            const myDriveItem = { id: 'root', name: 'My Drive', type: DATA_TYPES.FOLDER };
            segments.push({ label: 'My Drive', path: ROUTES.PROTECTED.USER.MY_DRIVE, item: myDriveItem });

            if (breadcrumbPath.length > 0) {
                breadcrumbPath.forEach((folder, index) => {
                    const isLast = index === breadcrumbPath.length - 1;
                    const path = isLast ? null : ROUTES.PROTECTED.USER.FOLDER.replace(':folderId', folder.id);
                    segments.push({ label: folder.name, path: path, item: folder });
                });
            } else {
                segments.push({ label: '...', path: null });
            }

            return segments;
        }

        const activeItem = navItems.find((item) => isActive(item.path));
        if (!activeItem) {
            segments.push({ label: 'Dashboard', path: null });
            return segments;
        }

        segments.push({ label: activeItem.label, path: null });
        return segments;
    };

    // Extract user data reliably (handle possible { data: { ... } } structure)
    const currentUser = user?.data || user;

    const userName = currentUser?.firstName
        ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
        : currentUser?.name || 'User';

    const userInitials = currentUser?.firstName
        ? `${currentUser.firstName[0]}${currentUser?.lastName ? currentUser.lastName[0] : ''}`.toUpperCase()
        : currentUser?.name
            ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            : 'U';

    const renderNavItem = (item, collapsed = false, onClickCallback = null) => {
        const isNotif = item.label === 'Notifications';
        const count = isNotif ? Number(unreadCount) : 0;
        const hasUnread = count > 0;
        const active = isActive(item.path);

        return (
            <Link
                key={item.path}
                to={item.path}
                onClick={onClickCallback}
                title={collapsed ? item.label : ''}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-all duration-200 relative border border-transparent
                    ${active
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-600 hover:border-slate-200'
                    }
                    ${collapsed ? 'justify-center' : ''}`}
            >
                <div className="relative">
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500 hover:text-brand '}`} />
                    {hasUnread && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                        </span>
                    )}
                </div>
                {!collapsed && (
                    <>
                        <span className="flex-1">{item.label}</span>
                        {hasUnread && (
                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                {count > 99 ? '99+' : count}
                            </span>
                        )}
                    </>
                )}
            </Link>
        );
    };

    const renderSectionHeader = (title, collapsed = false, hasMenu = false) => {
        if (collapsed) return null;
        return (
            <div className="flex items-center justify-between px-3 pt-6 pb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
                {hasMenu && (
                    <button className="text-slate-400 hover:text-slate-600">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="3" r="1.5" />
                            <circle cx="8" cy="8" r="1.5" />
                            <circle cx="8" cy="13" r="1.5" />
                        </svg>
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="h-screen overflow-hidden flex bg-slate-50 relative" {...dragProps}>
            {isDragging && (
                <div className="absolute inset-0 z-[100] bg-blue-50/90 border-[6px] border-blue-400 m-2 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none transition-all duration-300">
                    <div className="bg-white p-8 rounded-full shadow-lg mb-6 animate-bounce">
                        <UploadCloud className="w-16 h-16 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-medium text-blue-700">Drop files to upload</h3>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => handleUpload(e.target.files)}
            />
            <input
                type="file"
                ref={folderInputRef}
                className="hidden"
                webkitdirectory=""
                directory=""
                onChange={(e) => handleUpload(e.target.files)}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 my-2  bg-white rounded-r-lg border-r border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 flex-shrink-0">
                        <Link to={ROUTES.PROTECTED.USER.DASHBOARD} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-sm overflow-hidden flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-full h-full">
                                    <path fill="#4285F4" d="M15.427 1L9.294 11.667h12.266z" />
                                    <path fill="#34A853" d="M1.501 22h12.266L7.633 11.333z" />
                                    <path fill="#FBBC04" d="M7.633 11.333L1.5 22l6.133-10.667z" />
                                    <path fill="#EA4335" d="M22.5 22L16.367 11.333l-6.134 10.667z" />
                                </svg>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <span className="font-semibold text-slate-700 text-lg">Drive</span>
                            </div>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2">
                        <div className="px-3 mb-6 mt-4">
                            <Button className="w-auto bg-white hover:bg-slate-50 text-slate-700 shadow-md border border-slate-100 rounded flex items-center gap-3 transition-all group">
                                <Plus className="h-6 w-6 text-brand-500" />
                                <span className="font-medium text-base">New</span>
                            </Button>
                        </div>

                        <div className="space-y-0.5 mb-6">
                            {generalItems.map((item) => renderNavItem(item, false, () => setSidebarOpen(false)))}
                        </div>

                        <div className="space-y-0.5 mb-6">
                            {middleItems.map((item) => renderNavItem(item, false, () => setSidebarOpen(false)))}
                        </div>

                        <div className="space-y-0.5">
                            {bottomDriveItems.map((item) => renderNavItem(item, false, () => setSidebarOpen(false)))}
                        </div>
                    </nav>


                </div>
            </aside>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`hidden lg:flex flex-col relative z-10 h-full bg-slate-50  transition-all duration-300  
                    ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}
            >
                <div className="flex flex-col h-full ">
                    <div className={`h-16 flex items-center mt-2.5  ${isSidebarCollapsed ? 'justify-center ' : 'px-3'} border-b border-slate-200 flex-shrink-0`}>
                        <Link to={ROUTES.PROTECTED.USER.DASHBOARD} className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded bg-gradient-to-br from-sky-600 to-[#082f49] text-white shadow-lg shadow-sky-600/20 group-hover:scale-105 transition-transform duration-300">
                                <Cloud size={20} fill="currentColor" />
                            </div>
                            {!isSidebarCollapsed && (
                                <span className="text-xl font-bold tracking-tight text-[#082f49]">
                                    CloudDrive
                                </span>
                            )}
                        </Link>
                    </div>

                    <div ref={newButtonRef} className={` px-3 relative mt-4 mb-2 ${isSidebarCollapsed ? ' flex justify-center items-center' : 'px-0'}`}>
                        <Button
                            onClick={() => setShowNewButtonMenu(!showNewButtonMenu)}
                            className={`${isSidebarCollapsed ? 'w-10 h-10 p-0 justify-center' : 'w-full justify-start'} bg-white hover:bg-slate-50 text-slate-700 border border-slate-100 hover:border-slate-200 rounded flex items-center  transition-all group`}>
                            <Plus className="h-4 w-4 text-brand-500" />
                            {!isSidebarCollapsed && <span className="font-medium ">New</span>}
                        </Button>
                        {showNewButtonMenu && (
                            <div className="absolute top-full left-0 w-full ml-3 z-50">
                                <NewButtonMenu
                                    setShowNewButtonMenu={setShowNewButtonMenu}
                                    setIsNewFolderDialogOpen={setIsNewFolderDialogOpen}
                                    setIsFileUploadDialogOpen={setIsFileUploadDialogOpen}
                                    setIsFolderUploadDialogOpen={setIsFolderUploadDialogOpen}
                                />
                            </div>
                        )}
                    </div>
                    <nav className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden px-3 py-2">


                        <div className="space-y-0.5 mb-6">
                            {generalItems.map((item) => renderNavItem(item, isSidebarCollapsed))}
                        </div>

                        <div className="space-y-0.5 mb-6">
                            {middleItems.map((item) => renderNavItem(item, isSidebarCollapsed))}
                        </div>

                        <div className="space-y-0.5">
                            {bottomDriveItems.map((item) => renderNavItem(item, isSidebarCollapsed))}
                        </div>
                    </nav>

                    <div className="border-t border-slate-200 bg-slate-50/50">
                        <div className={`p-3 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
                            <button
                                onClick={toggleSidebar}
                                className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm transition-all duration-200 w-full
                                    ${isSidebarCollapsed ? 'justify-center border border-transparent hover:border-slate-200' : ''}`}
                            >
                                {isSidebarCollapsed ? (
                                    <ChevronRight className="h-5 w-5 text-slate-500" />
                                ) : (
                                    <>
                                        <ChevronLeft className="h-5 w-5 text-slate-500" />
                                        <span>Collapse</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden bg-white my-3 mr-3 border border-slate-200 rounded relative z-0">

                <header className="lg:hidden h-14 flex-none bg-white border-b border-slate-100 flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(true)}
                            className="text-brand-500 -ml-2"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-1.5 text-sm overflow-hidden truncate">
                            <span
                                onClick={() => navigate(ROUTES.PROTECTED.USER.DASHBOARD)}
                                className="text-slate-500 cursor-pointer text-xs"
                            >
                                Drive
                            </span>
                            {getBreadcrumbSegments().map((segment, index, arr) => (
                                <React.Fragment key={index}>
                                    <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
                                    {segment.path && index < arr.length - 1 ? (
                                        <span
                                            onClick={() => navigate(segment.path)}
                                            className="text-slate-500 cursor-pointer truncate text-xs"
                                        >
                                            {segment.label}
                                        </span>
                                    ) : (
                                        <span className="font-bold text-slate-900 truncate text-xs">
                                            {segment.label}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:bg-slate-50 rounded-full transition-colors outline-none">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">
                                        {userInitials}
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl shadow-xl border-slate-200">
                                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                                </div>
                                <DropdownMenuItem
                                    className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg text-slate-600 focus:bg-slate-50 focus:text-slate-900"
                                    onClick={() => ROUTES.PROTECTED.USER.SETTINGS?.BASE && navigate(ROUTES.PROTECTED.USER.SETTINGS.BASE)}
                                >
                                    <Settings className="h-4 w-4" />
                                    <span className="text-sm font-medium">Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100" />
                                <DropdownMenuItem
                                    className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm font-medium">Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <header className="hidden lg:flex h-16 flex-none items-center justify-between px-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-sm">
                        <span onClick={() => navigate(ROUTES.PROTECTED.USER.DASHBOARD)} className="text-slate-500 cursor-pointer hover:underline">Drive</span>
                        {getBreadcrumbSegments().map((segment, index, arr) => (
                            <span key={index} className="flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-slate-300" />
                                {segment.path && index < arr.length - 1 ? (
                                    <span
                                        onClick={() => navigate(segment.path)}
                                        className="text-slate-500 cursor-pointer hover:underline"
                                    >
                                        {segment.label}
                                    </span>
                                ) : (
                                    <div className="relative">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="flex items-center gap-2 px-1 py-1 h-auto font-medium text-slate-900 hover:bg-slate-100 rounded outline-none"
                                                >
                                                    {segment.label}
                                                    <ChevronDown className="h-4 w-4 text-slate-900" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <MoreButtonMenu
                                                item={segment.item}
                                                onNewFolder={() => setIsNewFolderDialogOpen(true)}
                                            />
                                        </DropdownMenu>
                                    </div>
                                )}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <AgentStatusIndicator variant="compact" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors outline-none">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">
                                        {userInitials}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{userName}</span>
                                    <ChevronDown className="h-4 w-4 text-slate-400 ml-1" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-1 rounded-xl shadow-xl border-slate-200">
                                <div className="px-3 py-3 border-b border-slate-100 mb-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base">
                                            {userInitials}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                                            <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                                        </div>
                                    </div>
                                   
                                </div>

                                <DropdownMenuSeparator className="bg-slate-100 mx-1" />

                                <DropdownMenuItem
                                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="text-sm font-medium">Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>

            <NewFolderDialog
                open={isNewFolderDialogOpen}
                onOpenChange={setIsNewFolderDialogOpen}
                onCreate={handleCreateFolder}
            />
            <FileUploadDialog
                open={isFileUploadDialogOpen}
                onOpenChange={setIsFileUploadDialogOpen}
                onUpload={(files) => handleUpload(files, getCurrentFolderId())}
            />

            <FolderUploadDialog
                open={isFolderUploadDialogOpen}
                onOpenChange={setIsFolderUploadDialogOpen}
                onUpload={(files) => handleUpload(files, getCurrentFolderId())}
            />

            <FilePreviewModal />
            <UploadProgressWidget />
            <ActionFeedback />
        </div>
    );
}
