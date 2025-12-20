import { User, Target, TrendingUp, BookOpen, Star, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CareerPath {
  title: string;
  description: string;
  skills_to_develop: string[];
  timeline: string;
  potential_salary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface AnalysisData {
  profile_summary: string;
  current_skills: string[];
  strengths: string[];
  areas_for_improvement: string[];
  career_paths: CareerPath[];
  immediate_action_items: string[];
  positive_feedback: string;
}

interface AnalysisResultsProps {
  data: AnalysisData;
  onReset: () => void;
}

export const AnalysisResults = ({ data, onReset }: AnalysisResultsProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-success/10 text-success';
      case 'Intermediate':
        return 'bg-accent/10 text-accent';
      case 'Advanced':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Positive Feedback Banner */}
      <div className="gradient-success rounded-2xl p-6 text-success-foreground shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-success-foreground/20 rounded-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Great News!</h3>
            <p className="opacity-90">{data.positive_feedback}</p>
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 gradient-primary rounded-xl">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Profile Summary</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">{data.profile_summary}</p>
      </div>

      {/* Skills & Strengths Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Skills */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Current Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.current_skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Your Strengths
          </h3>
          <ul className="space-y-2">
            {data.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <ChevronRight className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Areas for Improvement */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Growth Opportunities
        </h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {data.areas_for_improvement.map((area, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground bg-muted/30 p-3 rounded-xl">
              <ChevronRight className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* Career Paths */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <div className="p-2 gradient-accent rounded-xl">
            <TrendingUp className="w-6 h-6 text-accent-foreground" />
          </div>
          Your Career Roadmap
        </h2>
        
        <div className="grid gap-6">
          {data.career_paths.map((path, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{path.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Timeline: {path.timeline}
                    </span>
                    <span className="text-sm font-semibold text-success">
                      {path.potential_salary}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">{path.description}</p>
              
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Skills to Develop:</h4>
                <div className="flex flex-wrap gap-2">
                  {path.skills_to_develop.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${path.title} career guide roadmap`)}`, '_blank')}
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Action Items */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Your Next Steps
        </h3>
        <ol className="space-y-3">
          {data.immediate_action_items.map((action, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 gradient-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{action}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Reset Button */}
      <div className="text-center pt-4">
        <Button variant="outline" size="lg" onClick={onReset}>
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
};
