"use client"
import { useState } from 'react';
import { Sparkles, Rocket, Target, Shield } from 'lucide-react';
import { ResumeUpload } from '@/components/ResumeUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingAnalysis } from '@/components/LoadingAnalysis';
import { InteractiveBackground } from '@/components/InteractiveBackground';

interface AnalysisData {
    profile_summary: string;
    current_skills: string[];
    strengths: string[];
    areas_for_improvement: string[];
    career_paths: {
        title: string;
        description: string;
        skills_to_develop: string[];
        timeline: string;
        potential_salary: string;
        difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    }[];
    immediate_action_items: string[];
    positive_feedback: string;
}


const Index = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    // const { toast } = useToast();

    const handleFileSelect = async (file: File, userGoals?: string, desiredDirection?: string) => {
        setIsAnalyzing(true);

        try {
            // Validate PDF
            if (file.type !== "application/pdf") {
                alert("Only PDF files are allowed");
                return;
            }

            // Prepare FormData
            const formData = new FormData();
            formData.append("file", file);
            if (userGoals) formData.append("userGoals", userGoals);
            if (desiredDirection) formData.append("desiredDirection", desiredDirection);

            // Call Next.js API
            const response = await fetch("/api/parse-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "PDF parsing failed");
            }

            const data = await response.json();

            console.log("API Response:", data);

            // Check if roadmap generation was successful
            if (!data.success) {
                throw new Error(data.error || "Failed to generate career roadmap");
            }

            // Check if roadmap data exists
            if (!data.content?.roadmap?.data) {
                throw new Error("No roadmap data returned from server");
            }

            // Set the roadmap data for display
            setAnalysisData(data.content.roadmap.data);

        } catch (error) {
            console.error("Analysis error:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setAnalysisData(null);
    };
    

    return (
        <div className="h-screen bg-background  flex flex-col relative">
            {/* Interactive Background */}
            <InteractiveBackground />
            
            {/* Hero Section */}
            {!analysisData && !isAnalyzing && (
                <header className="relative overflow-hidden flex-1 flex items-center justify-center z-10">
                    <div className="container relative">
                        <div className="text-center max-w-3xl mx-auto">
                            {/* Brand Logo */}
                            <div className="mb-6 animate-fade-in">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                                    <span className="bg-gradient-to-r from-violet-500 via-primary to-fuchsia-500 bg-clip-text text-transparent drop-shadow-2xl">
                                        Pathr
                                    </span>
                                    <span className="text-primary/60">.</span>
                                </h1>
                                <div className="h-1 w-20 mx-auto mt-2 rounded-full bg-gradient-to-r from-violet-500 via-primary to-fuchsia-500" />
                            </div>

                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-medium mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                                <Sparkles className="w-3 h-3" />
                                AI-Powered Career Growth
                            </div>

                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 animate-slide-up" style={{ animationDelay: '150ms' }}>
                                Transform Your Resume Into a
                                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> Career Roadmap</span>
                            </h2>

                            <p className="text-sm md:text-base text-muted-foreground animate-slide-up" style={{ animationDelay: '200ms' }}>
                                Upload your resume and let our AI analyze your skills and create a personalized roadmap.
                            </p>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="container flex-1 flex items-center justify-center z-10">
                {isAnalyzing ? (
                    <LoadingAnalysis />
                ) : analysisData ? (
                    <div className="w-full h-full overflow-auto py-4">
                        <AnalysisResults data={analysisData} onReset={handleReset} />
                    </div>
                ) : (
                    <ResumeUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-border shrink-0 z-10 bg-background/80 backdrop-blur-sm">
                <div className="container py-3">
                    <p className="text-center text-xs text-muted-foreground">
                        <span className="font-semibold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Pathr</span> • Your resume is analyzed securely and never stored.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
