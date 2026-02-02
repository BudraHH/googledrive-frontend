import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({
    title = "No files yet",
    description = "Upload your first file to get started",
    actionLabel = "Upload file",
    onAction = null,
    iconClassName = "text-slate-300",
    showAction = false
}) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
            <div className="relative mb-6">
                {/* Decorative background circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-slate-100 rounded-full opacity-50"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full"></div>
                </div>

            </div>

            {/* Text Content */}
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mb-8">
                {description}
            </p>

            {/* Action Button */}
            {showAction && onAction && (
                <Button
                    onClick={onAction}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
