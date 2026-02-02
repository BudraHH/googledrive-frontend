import { FileUp, FolderPlus, FolderUp } from "lucide-react";
import { Button } from "../ui/button";

const NewButtonMenu = ({ setShowNewButtonMenu, setIsNewFolderDialogOpen, setIsFileUploadDialogOpen, setIsFolderUploadDialogOpen }) => {
    return (
        <div className="absolute top-full left-0 mt-2 z-10 w-64 rounded border border-slate-200 bg-white shadow-sm p-1">

            <Button
                className="bg-white border border-white hover:bg-slate-50 hover:text-slate-600 flex w-full items-center justify-between  px-1 py-2.5 "
                onClick={() => {
                    setShowNewButtonMenu(false);
                    setIsNewFolderDialogOpen(true);
                }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex p-2 items-center justify-center rounded bg-slate-100 text-slate-600">
                            <FolderPlus className="h-4 w-4" />
                        </div>
                        <span className="truncate text-slate-600">New folder</span>
                    </div>
                    <span className="text-xs text-slate-500">Alt + C, then F</span>
                </Button  >

                <div className="mx-3 my-2 h-px bg-slate-100" />

                <Button
                    className="bg-white border border-white hover:bg-slate-50 hover:text-slate-600 flex w-full items-center justify-between  px-1 py-2.5 "
                    onClick={() => {
                        setShowNewButtonMenu(false);
                        setIsFileUploadDialogOpen(true);
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600">
                            <FileUp className="h-4 w-4" />
                        </div>
                        <span className="truncate text-slate-600">File upload</span>
                    </div>
                    <span className="text-xs text-slate-500">Alt + C, then U</span>
                </Button>

                <Button
                    className="bg-white border border-white hover:bg-slate-50 hover:text-slate-600 flex w-full items-center justify-between  px-1 py-2.5 "
                    onClick={() => {
                        setShowNewButtonMenu(false);
                        setIsFolderUploadDialogOpen(true);
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-600">
                            <FolderUp className="h-4 w-4" />
                        </div>
                        <span className="truncate text-slate-600">Folder upload</span>
                    </div>
                    <span className="text-xs text-slate-500">Alt + C, then I</span>
                </Button>

            </div>
        );
    };



export default NewButtonMenu;
