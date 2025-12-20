import { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
 
interface ResumeUploadProps {
    onFileSelect: (file: File) => void;
    isAnalyzing: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ResumeUpload = ({ onFileSelect, isAnalyzing }: ResumeUploadProps) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
 
    const validateFile = (file: File): boolean => {
        if (file.type !== 'application/pdf') {
            // toast({
            //     title: "Invalid file type",
            //     description: "Please upload a PDF file only.",
            //     variant: "destructive",
            // });
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            // toast({
            //     title: "File too large",
            //     description: "Please upload a file smaller than 10MB.",
            //     variant: "destructive",
            // });
            return false;
        }

        return true;
    };

    const handleFile = (file: File) => {
        if (validateFile(file)) {
            setSelectedFile(file);
        }
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const handleAnalyze = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!selectedFile ? (
                <div
                    className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer group ${dragActive
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className={`p-4 rounded-2xl transition-all duration-300 ${dragActive
                            ? 'gradient-primary shadow-glow'
                            : 'bg-primary/10 group-hover:bg-primary/20'
                            }`}>
                            <Upload className={`w-8 h-8 transition-colors ${dragActive ? 'text-primary-foreground' : 'text-primary'
                                }`} />
                        </div>

                        <div>
                            <p className="text-lg font-semibold text-foreground">
                                {dragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                or click to browse files
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>PDF only • Max 10MB</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border border-border rounded-2xl p-6 bg-card animate-scale-in">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>

                        <button
                            onClick={handleRemoveFile}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            disabled={isAnalyzing}
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <Button
                        variant="default"
                        size="lg"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full mt-6"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Analyzing your resume...
                            </>
                        ) : (
                            'Analyze My Resume'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};
