import { useState } from 'react';
import { User, Target, TrendingUp, BookOpen, Download, ZoomIn, ZoomOut, MapPin, CheckCircle2, ArrowRight, Clock, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [zoom, setZoom] = useState(100);
  const [expandedNode, setExpandedNode] = useState<number | null>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const toggleNode = (index: number) => {
    setExpandedNode(expandedNode === index ? null : index);
  };

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
    return 90; // default 3 months
  };



  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      let yPos = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);

      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, maxWidth);
        
        lines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, margin, yPos);
          yPos += fontSize * 0.5;
        });
        yPos += 5;
      };

      // Title
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Career Roadmap', margin, yPos);
      yPos += 15;

      // Current Status
      addText('CURRENT STATUS', 16, true);
      addText(data.profile_summary);
      addText(`Skills: ${data.current_skills.join(', ')}`);
      yPos += 5;

      // Career Paths
      addText('CAREER PATHS', 18, true);
      data.career_paths.forEach((path, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        addText(`Path ${index + 1}: ${path.title}`, 14, true);
        addText(`Timeline: ${path.timeline} | Salary: ${path.potential_salary}`);
        addText(path.description);
        addText(`Skills Needed: ${path.skills_to_develop.join(', ')}`);
        yPos += 5;
      });

      // Action Items
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      addText('ACTION STEPS', 18, true);
      data.immediate_action_items.forEach((action, index) => {
        addText(`${index + 1}. ${action}`);
      });

      doc.save('career-roadmap.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold">Your Career Roadmap</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button onClick={handleDownloadPDF} size="sm" className="ml-2">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Current Status</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{data.profile_summary}</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Your Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.current_skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              Areas to Develop
            </h3>
            <ul className="space-y-1">
              {data.areas_for_improvement.slice(0, 3).map((area, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400">• {area}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Visual Roadmap - Interactive Journey */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-900 shadow-lg overflow-x-auto">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <MapPin className="w-6 h-6 text-blue-600" />
          Your Career Journey Map
        </h2>
        
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', transition: 'transform 0.3s' }}>
          {/* Journey Path */}
          <div className="relative min-h-[600px]">
            {/* Connecting Path Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-600 transform -translate-x-1/2 hidden md:block" />
            
            {/* Journey Nodes */}
            <div className="space-y-16">
              {/* Start Node */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-green-500 shadow-2xl flex items-center justify-center animate-pulse">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-sm font-bold text-green-700 dark:text-green-400">START HERE</span>
                  </div>
                </div>
              </div>

              {/* Career Path Nodes */}
              {data.career_paths.map((path, index) => {
                const days = timelineToDays(path.timeline);
                const isExpanded = expandedNode === index;
                const nodeColor = index === 0 ? 'blue' : index === 1 ? 'indigo' : 'purple';
                
                return (
                  <div key={index} className="relative">
                    {/* Connector Arrow */}
                    <div className="flex justify-center mb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-12 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700" />
                        <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                      </div>
                    </div>

                    {/* Node Container */}
                    <div className={`flex flex-col md:flex-row items-center justify-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Node Circle - Clickable */}
                      <div 
                        onClick={() => toggleNode(index)}
                        className={`relative cursor-pointer group hover:scale-110 transition-all duration-300 z-10`}
                      >
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-${nodeColor}-500 to-${nodeColor}-700 shadow-2xl flex flex-col items-center justify-center ring-4 ring-${nodeColor}-200 dark:ring-${nodeColor}-900 hover:ring-8 transition-all`}>
                          <span className="text-2xl font-bold text-white">{index + 1}</span>
                          <span className="text-xs text-white/80">{days} days</span>
                        </div>
                        
                        {/* Click Indicator */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-bounce" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-bounce" />
                          )}
                        </div>
                      </div>

                      {/* Node Info Card */}
                      <div className={`flex-1 max-w-md transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-90'}`}>
                        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-${nodeColor}-300 dark:border-${nodeColor}-700 hover:shadow-2xl transition-all`}>
                          {/* Header - Always Visible */}
                          <div className="mb-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                              {path.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                                <Clock className="w-3 h-3" />
                                {days} days ({path.timeline})
                              </span>
                              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-semibold">
                                💰 {path.potential_salary}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                path.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                path.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {path.difficulty}
                              </span>
                            </div>
                          </div>

                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                              <div>
                                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">📋 What You'll Do:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                  {path.description}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">🎯 Skills to Master:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {path.skills_to_develop.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium border border-indigo-200 dark:border-indigo-800">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Click to expand hint */}
                          {!isExpanded && (
                            <div className="mt-3 text-center">
                              <button 
                                onClick={() => toggleNode(index)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                              >
                                Click node to see details →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* End Node */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-12 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 mb-4" />
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl flex items-center justify-center animate-pulse">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-sm font-bold text-orange-700 dark:text-orange-400">SUCCESS! 🎉</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Summary */}
        <div className="mt-12 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-blue-700 dark:text-blue-300">Total Journey:</span> {' '}
            {data.career_paths.reduce((sum, path) => sum + timelineToDays(path.timeline), 0)} days ({Math.round(data.career_paths.reduce((sum, path) => sum + timelineToDays(path.timeline), 0) / 30)} months)
            {' '} | Click on any node to explore details!
          </p>
        </div>
      </div>

      {/* Action Steps */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-600" />
          Next Steps
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{data.positive_feedback}</p>
        
        <div className="space-y-3">
          {data.immediate_action_items.map((action, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700 dark:text-gray-300 pt-0.5">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={onReset} variant="outline" size="lg">
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;
