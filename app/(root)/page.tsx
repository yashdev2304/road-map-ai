"use client"
import { useState } from 'react';
import { Sparkles, Rocket, Target, Shield } from 'lucide-react';
import { ResumeUpload } from '@/components/ResumeUpload';
import { AnalysisResults } from '@/components/AnalysisResults';
import { LoadingAnalysis } from '@/components/LoadingAnalysis';

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

    const handleFileSelect = async (file: File) => {
        setIsAnalyzing(true);

        try {
            // Validate PDF
            if (file.type !== "application/pdf") {
                throw new Error("Only PDF files are allowed");
            }

            // Prepare FormData
            const formData = new FormData();
            formData.append("file", file);

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

            /**
             * data structure:
             * {
             *   success: true,
             *   metadata: {...},
             *   content: {
             *     fullText: string,
             *     pages: []
             *   }
             * }
             */

            console.log("Parsed PDF:", data);

            // Example: store parsed text for AI analysis
            // setAnalysisData(data.content.fullText);

            // toast({
            //   title: "Analysis Complete!",
            //   description: "Your resume has been parsed successfully.",
            // });

        } catch (error) {
            console.error("Analysis error:", error);

            // toast({
            //   title: "Analysis Failed",
            //   description:
            //     error instanceof Error
            //       ? error.message
            //       : "Something went wrong. Please try again.",
            //   variant: "destructive",
            // });

        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setAnalysisData(null);
    };
    

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            {!analysisData && !isAnalyzing && (
                <header className="relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 gradient-hero opacity-5" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="container relative py-16 md:py-24">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
                                <Sparkles className="w-4 h-4" />
                                AI-Powered Career Growth
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
                                Transform Your Resume Into a
                                <span className="text-gradient-primary"> Career Roadmap</span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '100ms' }}>
                                Upload your resume and let our AI analyze your skills, identify opportunities,
                                and create a personalized roadmap for your career growth.
                            </p>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="container py-8 md:py-12">
                {isAnalyzing ? (
                    <LoadingAnalysis />
                ) : analysisData ? (
                    <AnalysisResults data={analysisData} onReset={handleReset} />
                ) : (
                    <ResumeUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-border mt-auto">
                <div className="container py-6">
                    <p className="text-center text-sm text-muted-foreground">
                        Your resume is analyzed securely and never stored. Built with ❤️ for career growth.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
