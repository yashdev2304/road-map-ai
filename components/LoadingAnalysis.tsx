import { Sparkles, Brain, Target, TrendingUp } from 'lucide-react';

const steps = [
    { icon: Sparkles, text: 'Extracting resume content...' },
    { icon: Brain, text: 'Analyzing your experience & skills...' },
    { icon: Target, text: 'Identifying career opportunities...' },
    { icon: TrendingUp, text: 'Creating your personalized roadmap...' },
];

export const LoadingAnalysis = () => {
    return (
        <div className="w-full max-w-lg mx-auto text-center py-12">
            {/* Animated Logo */}
            <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto gradient-primary rounded-3xl flex items-center justify-center shadow-glow animate-pulse-slow">
                    <Brain className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="absolute inset-0 w-24 h-24 mx-auto gradient-primary rounded-3xl opacity-30 animate-ping" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
                Analyzing Your Resume
            </h2>
            <p className="text-muted-foreground mb-8">
                Our AI is working its magic to create your career roadmap
            </p>

            {/* Steps */}
            <div className="space-y-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border animate-fade-in"
                            style={{ animationDelay: `${index * 0.5}s` }}
                        >
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">{step.text}</span>
                            <div className="ml-auto">
                                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-muted-foreground mt-8">
                This usually takes 15-30 seconds
            </p>
        </div>
    );
};
