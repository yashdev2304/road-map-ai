import { useState } from 'react';
import { User, Target, TrendingUp, BookOpen, Download, Sparkles, Zap, Trophy, Clock, DollarSign, BarChart3, ChevronRight, Star, Rocket, GraduationCap } from 'lucide-react';
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
  const [selectedPath, setSelectedPath] = useState(0);

  // Convert timeline string to days
  const timelineToDays = (timeline: string): number => {
    const lower = timeline.toLowerCase();
    if (lower.includes('month')) {
      const months = parseInt(lower.match(/\d+/)?.[0] || '3');
      return months * 30;
    } else if (lower.includes('week')) {
      const weeks = parseInt(lower.match(/\d+/)?.[0] || '4');
      return weeks * 7;
    } else if (lower.includes('year')) {
      const years = parseInt(lower.match(/\d+/)?.[0] || '1');
      return years * 365;
    }
    return 90;
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return { color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: Star, label: 'Entry Level' };
      case 'Intermediate':
        return { color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/20', text: 'text-amber-400', icon: Zap, label: 'Growth Phase' };
      case 'Advanced':
        return { color: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/20', text: 'text-rose-400', icon: Trophy, label: 'Expert Track' };
      default:
        return { color: 'from-primary to-indigo-500', bg: 'bg-primary/20', text: 'text-primary', icon: Star, label: 'Career Path' };
    }
  };



  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPos = 0;

      // Colors (RGB values)
      const colors = {
        darkBg: [30, 32, 48],
        cardBg: [40, 44, 62],
        primary: [139, 92, 246],      // violet
        emerald: [16, 185, 129],
        amber: [245, 158, 11],
        rose: [244, 63, 94],
        white: [255, 255, 255],
        gray: [156, 163, 175],
        lightGray: [209, 213, 219],
      };

      const setColor = (color: number[], type: 'fill' | 'text' | 'draw' = 'fill') => {
        if (type === 'fill') doc.setFillColor(color[0], color[1], color[2]);
        else if (type === 'text') doc.setTextColor(color[0], color[1], color[2]);
        else doc.setDrawColor(color[0], color[1], color[2]);
      };

      const checkNewPage = (requiredSpace: number) => {
        if (yPos + requiredSpace > pageHeight - 20) {
          doc.addPage();
          // Add dark background to new page
          setColor(colors.darkBg);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          yPos = 20;
        }
      };

      const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number, color: number[]) => {
        setColor(color);
        doc.roundedRect(x, y, w, h, r, r, 'F');
      };

      // Page 1 - Dark Background
      setColor(colors.darkBg);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header with gradient effect (simulated with overlapping shapes)
      setColor(colors.primary);
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      // Add some decorative circles
      doc.setGState(doc.GState({ opacity: 0.3 }));
      setColor([167, 139, 250]);
      doc.circle(pageWidth - 30, 30, 40, 'F');
      doc.circle(30, 50, 25, 'F');
      doc.setGState(doc.GState({ opacity: 1 }));

      // Title
      setColor(colors.white, 'text');
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('Career Blueprint', margin, 35);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Personalized Career Roadmap', margin, 48);

      yPos = 80;

      // Profile Summary Card
      checkNewPage(60);
      drawRoundedRect(margin, yPos, maxWidth, 50, 3, colors.cardBg);
      
      // Card accent line
      setColor(colors.primary);
      doc.rect(margin, yPos, 4, 50, 'F');

      setColor(colors.primary, 'text');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Profile Summary', margin + 12, yPos + 15);

      setColor(colors.lightGray, 'text');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(data.profile_summary, maxWidth - 20);
      doc.text(summaryLines.slice(0, 3), margin + 12, yPos + 28);
      
      yPos += 60;

      // Skills Section
      checkNewPage(45);
      drawRoundedRect(margin, yPos, maxWidth, 35, 3, colors.cardBg);
      
      setColor(colors.emerald, 'text');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Current Skills', margin + 10, yPos + 12);

      // Skill badges
      let skillX = margin + 10;
      let skillY = yPos + 22;
      doc.setFontSize(8);
      data.current_skills.slice(0, 6).forEach((skill) => {
        const skillWidth = doc.getTextWidth(skill) + 10;
        if (skillX + skillWidth > pageWidth - margin) {
          skillX = margin + 10;
          skillY += 10;
        }
        
        // Badge background
        doc.setGState(doc.GState({ opacity: 0.3 }));
        setColor(colors.emerald);
        doc.roundedRect(skillX, skillY - 5, skillWidth, 8, 2, 2, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        
        setColor(colors.emerald, 'text');
        doc.text(skill, skillX + 5, skillY);
        skillX += skillWidth + 5;
      });

      yPos += 45;

      // Career Paths Section
      checkNewPage(20);
      setColor(colors.white, 'text');
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Recommended Career Paths', margin, yPos);
      yPos += 15;

      // Career Path Cards
      data.career_paths.forEach((path, index) => {
        checkNewPage(75);
        
        const days = timelineToDays(path.timeline);
        const pathColors = [colors.primary, colors.amber, colors.rose];
        const currentColor = pathColors[index % pathColors.length];

        // Main card
        drawRoundedRect(margin, yPos, maxWidth, 68, 4, colors.cardBg);

        // Colored header stripe
        setColor(currentColor);
        doc.roundedRect(margin, yPos, maxWidth, 20, 4, 4, 'F');
        doc.rect(margin, yPos + 10, maxWidth, 10, 'F');

        // Path number badge
        setColor(colors.white, 'text');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`PATH ${index + 1}`, margin + 8, yPos + 8);

        // Path title
        doc.setFontSize(14);
        doc.text(path.title, margin + 8, yPos + 16);

        // Description
        setColor(colors.lightGray, 'text');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(path.description, maxWidth - 16);
        doc.text(descLines.slice(0, 2), margin + 8, yPos + 30);

        // Stats row
        const statsY = yPos + 48;
        
        // Timeline badge
        doc.setGState(doc.GState({ opacity: 0.3 }));
        setColor(colors.primary);
        doc.roundedRect(margin + 8, statsY, 45, 12, 2, 2, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        setColor(colors.primary, 'text');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(path.timeline, margin + 12, statsY + 8);

        // Salary badge
        doc.setGState(doc.GState({ opacity: 0.3 }));
        setColor(colors.emerald);
        doc.roundedRect(margin + 58, statsY, 50, 12, 2, 2, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        setColor(colors.emerald, 'text');
        doc.text(path.potential_salary, margin + 62, statsY + 8);

        // Difficulty badge
        const diffColor = path.difficulty === 'Beginner' ? colors.emerald : 
                          path.difficulty === 'Intermediate' ? colors.amber : colors.rose;
        doc.setGState(doc.GState({ opacity: 0.3 }));
        setColor(diffColor);
        doc.roundedRect(margin + 113, statsY, 35, 12, 2, 2, 'F');
        doc.setGState(doc.GState({ opacity: 1 }));
        setColor(diffColor, 'text');
        doc.text(path.difficulty, margin + 117, statsY + 8);

        yPos += 78;
      });

      // Action Steps Section
      checkNewPage(30);
      yPos += 5;
      
      // Section header with accent
      setColor(colors.emerald);
      doc.roundedRect(margin, yPos, maxWidth, 18, 3, 3, 'F');
      setColor(colors.white, 'text');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Action Plan', margin + 8, yPos + 12);
      yPos += 25;

      // Action items
      data.immediate_action_items.forEach((action, index) => {
        checkNewPage(20);
        
        drawRoundedRect(margin, yPos, maxWidth, 16, 2, colors.cardBg);
        
        // Number circle
        setColor(colors.emerald);
        doc.circle(margin + 10, yPos + 8, 5, 'F');
        setColor(colors.white, 'text');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}`, margin + 8, yPos + 10);

        // Action text
        setColor(colors.lightGray, 'text');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const actionText = doc.splitTextToSize(action, maxWidth - 30);
        doc.text(actionText[0], margin + 20, yPos + 10);
        
        yPos += 20;
      });

      // Footer
      yPos = pageHeight - 15;
      setColor(colors.gray, 'text');
      doc.setFontSize(8);
      doc.text('Generated by roadmap.io | ' + new Date().toLocaleDateString(), margin, yPos);
      doc.text('www.roadmap.io', pageWidth - margin - 25, yPos);

      // Generate filename from first career path title
      const sanitizedName = data.career_paths[0]?.title?.replace(/[^a-zA-Z0-9]/g, '-') || 'Career';
      doc.save(`${sanitizedName}_roadmap.io.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-violet-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            Your Career Blueprint
          </h1>
          <p className="text-muted-foreground mt-1">Personalized paths tailored to your skills</p>
        </div>
        <Button onClick={handleDownloadPDF} className="bg-gradient-to-r from-primary to-violet-500 hover:opacity-90">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Profile Summary Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-secondary/30 p-6 rounded-2xl border border-border">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/30">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-2">Profile Analysis</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{data.profile_summary}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.current_skills.slice(0, 5).map((skill, i) => (
                <span key={i} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                  {skill}
                </span>
              ))}
              {data.current_skills.length > 5 && (
                <span className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                  +{data.current_skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Career Paths Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          Recommended Career Paths
        </h2>

        {/* Path Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {data.career_paths.map((path, index) => {
            const config = getDifficultyConfig(path.difficulty);
            const isSelected = selectedPath === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedPath(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  isSelected 
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg scale-105` 
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary border border-border'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                {path.title}
              </button>
            );
          })}
        </div>

        {/* Selected Path Details */}
        {data.career_paths[selectedPath] && (() => {
          const path = data.career_paths[selectedPath];
          const config = getDifficultyConfig(path.difficulty);
          const days = timelineToDays(path.timeline);
          const IconComponent = config.icon;
          
          return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Card */}
              <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden">
                {/* Card Header */}
                <div className={`p-6 bg-gradient-to-r ${config.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMxLjE4IDAgMi4yNy0uMTE1IDMuMzYtLjMxOCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white/80 text-sm font-medium">{config.label}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{path.title}</h3>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-6 space-y-6">
                  <p className="text-muted-foreground leading-relaxed">{path.description}</p>
                  
                  {/* Skills Grid */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Skills to Develop
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {path.skills_to_develop.map((skill, i) => (
                        <div 
                          key={i} 
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                        >
                          <ChevronRight className="w-3 h-3 text-primary" />
                          <span className="text-sm text-foreground">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-4">
                {/* Timeline Card */}
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Timeline</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{path.timeline}</div>
                  <div className="text-sm text-muted-foreground mt-1">~{days} days of focused learning</div>
                  <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-1000`}
                      style={{ width: `${Math.min((days / 365) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Salary Card */}
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Potential Earnings</span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-400">{path.potential_salary}</div>
                  <div className="text-sm text-muted-foreground mt-1">Market salary range</div>
                </div>

                {/* Difficulty Card */}
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                      <BarChart3 className={`w-4 h-4 ${config.text}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">Difficulty</span>
                  </div>
                  <div className={`text-xl font-bold ${config.text}`}>{path.difficulty}</div>
                  <div className="flex gap-1 mt-3">
                    {[1, 2, 3].map((level) => (
                      <div 
                        key={level}
                        className={`h-2 flex-1 rounded-full ${
                          (path.difficulty === 'Beginner' && level <= 1) ||
                          (path.difficulty === 'Intermediate' && level <= 2) ||
                          (path.difficulty === 'Advanced' && level <= 3)
                            ? `bg-gradient-to-r ${config.color}`
                            : 'bg-secondary'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
      {/* Action Steps */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Your Action Plan
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{data.positive_feedback}</p>
        </div>
        
        <div className="p-5 space-y-3">
          {data.immediate_action_items.map((action, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border hover:border-emerald-500/30 transition-colors group"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                {index + 1}
              </div>
              <p className="text-foreground pt-1 group-hover:text-foreground/90">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={onReset} 
          variant="outline" 
          size="lg" 
          className="border-border hover:bg-secondary hover:border-primary/30 transition-all"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;
