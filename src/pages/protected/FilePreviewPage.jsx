import { useParams } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FilePreviewPage() {
    const { fileId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-6">
            <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <FileText size={32} />
                </div>

                <div className="space-y-2">
                    <h1 className="text-xl font-semibold">File Preview</h1>
                    <p className="text-sm text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded inline-block">
                        ID: {fileId}
                    </p>
                    <p className="text-sm text-slate-500">
                        This is a placeholder for the file preview page.
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Go Back
                </Button>
            </div>
        </div>
    );
}
