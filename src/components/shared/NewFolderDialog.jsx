import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { filesAPI } from '@/services/api/filesAPI';

// Forbidden characters that can cause issues with file systems and URLs
const FORBIDDEN_CHARS = /[?*:|<>\\\/]/;
const FORBIDDEN_CHARS_DISPLAY = '? * : | < > \\ /';

export default function NewFolderDialog({ open, onOpenChange, onCreate }) {
    const [folderName, setFolderName] = useState("Untitled folder");
    const [error, setError] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const inputRef = useRef(null);
    const params = useParams();

    // Determine the next available default name (e.g. "Untitled folder (1)")
    const getNextDefaultName = async () => {
        try {
            setIsChecking(true);
            const parentId = params.folderId || null; // Null for root
            const items = await filesAPI.getItems(parentId);

            // Filter only folders and normalize names
            const existingNames = new Set(
                items
                    .filter(item => item.type === 'folder' || item.type === 'shared_folder')
                    .map(item => item.name.toLowerCase())
            );

            let baseName = "Untitled folder";
            let finalName = baseName;
            let counter = 1;

            // Check if name exists, incrément counter until unique
            while (existingNames.has(finalName.toLowerCase())) {
                finalName = `${baseName} (${counter})`;
                counter++;
            }

            setFolderName(finalName);

            // Focus and select the new name
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                }
            }, 50);

        } catch (err) {
            console.error("Failed to check existing folder names", err);
            // Fallback to basic default
            setFolderName("Untitled folder");
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                }
            }, 50);
        } finally {
            setIsChecking(false);
        }
    };

    // Reset state and calculate name when dialog opens
    useEffect(() => {
        if (open) {
            setError("");
            setIsCreating(false);
            getNextDefaultName();
        }
    }, [open]);

    // Validate folder name
    const validateName = (name) => {
        if (!name.trim()) {
            return "Folder name cannot be empty";
        }
        if (FORBIDDEN_CHARS.test(name)) {
            return `Name cannot contain these characters: ${FORBIDDEN_CHARS_DISPLAY}`;
        }
        if (name.trim().length > 255) {
            return "Folder name is too long (max 255 characters)";
        }
        return "";
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setFolderName(newName);

        // Clear error when user starts typing valid characters
        const validationError = validateName(newName);
        if (error && !validationError) {
            setError("");
        }
    };

    const handleCreate = async () => {
        // Validate before creating
        const validationError = validateName(folderName);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsCreating(true);
        setError("");

        try {
            await onCreate(folderName.trim());
            onOpenChange(false);
        } catch (err) {
            // Handle error from parent (e.g., API error)
            setError(err.message || "Failed to create folder");
        } finally {
            setIsCreating(false);
        }
    };

    if (!open) return null;

    const hasError = error !== "";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => !isCreating && onOpenChange(false)}
        >
            <div
                className="w-full max-w-sm rounded-lg bg-white border border-slate-200 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Title */}
                <h2 className="mb-4 text-lg font-medium text-slate-900 flex justify-between items-center">
                    New folder
                    {isChecking && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                </h2>

                {/* Input */}
                <div className="space-y-2">
                    <Input
                        ref={inputRef}
                        value={folderName}
                        onChange={handleNameChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !isCreating) handleCreate();
                            if (e.key === "Escape" && !isCreating) onOpenChange(false);
                        }}
                        className={`${hasError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        disabled={isCreating || isChecking}
                        placeholder={isChecking ? "Checking names..." : "Enter folder name"}
                    />

                    {/* Error message */}
                    {hasError && (
                        <div className="flex items-center gap-1.5 text-red-600 text-sm">
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        disabled={isCreating}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleCreate}
                        disabled={!folderName.trim() || isCreating || isChecking}
                        size="sm"
                    >
                        {isCreating ? "Creating..." : "Create"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
