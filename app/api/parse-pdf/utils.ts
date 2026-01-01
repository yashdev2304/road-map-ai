import { GoogleGenerativeAI } from "@google/generative-ai";

// ===== Type Definitions =====

export interface CareerPath {
    title: string;
    description: string;
    skills_to_develop: string[];
    timeline: string;
    potential_salary: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface RoadmapData {
    profile_summary: string;
    current_skills: string[];
    strengths: string[];
    areas_for_improvement: string[];
    career_paths: CareerPath[];
    immediate_action_items: string[];
    positive_feedback: string;
}

interface ParsedPdfContent {
    content: {
        fullText: string;
    };
    userGoals?: string;
    desiredDirection?: string;
}

interface RoadmapResult {
    success: boolean;
    data?: RoadmapData;
    error?: string;
    message?: string;
}

// ===== System Prompt =====

const CAREER_SYSTEM_PROMPT = `You are an empowering career counselor and motivational coach specializing in tech careers. 
Your mission is to inspire candidates while providing actionable career guidance.

Analyze the resume and respond ONLY with valid JSON in this EXACT format (no additional text):
{
  "profile_summary": "A warm, encouraging 2-3 sentence summary highlighting their current position and potential",
  "current_skills": ["skill1", "skill2", "skill3"],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areas_for_improvement": ["area 1", "area 2", "area 3"],
  "career_paths": [
    {
      "title": "Career Path Name",
      "description": "Exciting description of this path",
      "skills_to_develop": ["skill1", "skill2"],
      "timeline": "6-12 months",
      "potential_salary": "$70K - $100K",
      "difficulty": "Intermediate"
    }
  ],
  "immediate_action_items": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "positive_feedback": "An enthusiastic, motivating message celebrating their decision to grow and develop their career!"
}

Be encouraging, specific, and actionable. Make them feel excited about their future!`;

// ===== Main Execution Function =====

// ... (Your interfaces and system prompt remain the same)

export async function generateCareerRoadmap(
    parsedPdf: ParsedPdfContent
): Promise<RoadmapResult> {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error("GOOGLE_API_KEY is not configured.");
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

        // FIX 1: Use a valid model name (gemini-1.5-flash)
        // FIX 2: Enable JSON mode for more reliable parsing
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `${CAREER_SYSTEM_PROMPT}

Resume Content:
${parsedPdf.content.fullText}

${parsedPdf.userGoals ? `\nUser's Career Goals: ${parsedPdf.userGoals}` : ''}
${parsedPdf.desiredDirection ? `\nDesired Direction: ${parsedPdf.desiredDirection}` : ''}

Please analyze this resume and provide career guidance in the specified JSON format.`;

        console.log("Generating career roadmap...");
        const result = await model.generateContent(prompt);
        const response = result.response;
        const content = response.text().trim();

        // FIX 3: Since we used application/json, we can usually parse directly, 
        // but keeping your regex logic as a safety net is fine.
        const jsonMatch = content.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Could not extract JSON from AI response");
        }

        const roadmapData: RoadmapData = JSON.parse(jsonMatch[0]);

        if (!roadmapData.profile_summary || !roadmapData.career_paths) {
            throw new Error("Invalid roadmap data structure received from AI");
        }

        console.log("✅ Career roadmap generated successfully!");

        return {
            success: true,
            data: roadmapData,
            message: "Career roadmap generated successfully!"
        };

    } catch (error: any) {
        console.error("Failed to generate roadmap:", error);
        return {
            success: false,
            error: error.message || "Unknown error occurred",
            message: "Failed to generate career roadmap."
        };
    }
}

// For testing purposes
export async function testRoadmapGeneration() {
    const examplePdf: ParsedPdfContent = {
        content: {
            fullText: `
John Doe
Software Developer

EDUCATION
Bachelor of Science in Computer Science
XYZ University, 2022

SKILLS
- JavaScript, TypeScript, Python
- React, Node.js
- Git, Docker
- Basic knowledge of AWS

EXPERIENCE
Junior Developer at Tech Corp (2022-Present)
- Built web applications using React
- Collaborated with team on API development

PROJECTS
- E-commerce website with React and Node.js
- Personal portfolio website
            `,
        },
    };

    const result = await generateCareerRoadmap(examplePdf);
    console.log(JSON.stringify(result, null, 2));
}