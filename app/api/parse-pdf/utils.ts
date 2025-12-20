import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import {
    Annotation,
    END,
    MessagesAnnotation,
    START,
    StateGraph,
} from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as z from "zod";

// ===== Type Definitions =====

const RoadmapSchema = z.object({
    candidateProfile: z.object({
        name: z.string(),
        currentLevel: z.enum(["Beginner", "Fresher", "Intermediate"]),
        primaryDomain: z.string(),
        strengths: z.array(z.string()),
        gaps: z.array(z.string()),
    }),
    recommendedRoles: z.array(
        z.object({
            role: z.string(),
            matchScore: z.number().min(0).max(100),
            reason: z.string(),
        })
    ),
    learningRoadmap: z.array(
        z.object({
            phase: z.string(),
            duration: z.string(),
            focusAreas: z.array(z.string()),
            resources: z.array(z.string()),
            outcome: z.string(),
        })
    ),
    projectSuggestions: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
            skillsCovered: z.array(z.string()),
        })
    ),
    next90DaysPlan: z.array(
        z.object({
            week: z.string(),
            goals: z.array(z.string()),
        })
    ),
});

type Roadmap = z.infer<typeof RoadmapSchema>;

interface ParsedPdfContent {
    content: {
        fullText: string;
    };
}

// ===== System Prompt =====

const CAREER_SYSTEM_PROMPT = `You are an expert career counselor and technical recruiter with deep knowledge of the tech industry.

Your task is to analyze a candidate's resume and generate a comprehensive career roadmap.

When you receive resume text, use the generateRoadmap tool to process it. After processing, provide:
1. A detailed profile analysis identifying strengths and skill gaps
2. Recommended roles with match scores (0-100) based on current skills
3. A phased learning roadmap with specific resources and outcomes
4. Practical project suggestions that demonstrate required skills
5. A detailed 90-day action plan with weekly goals

Be specific, actionable, and encouraging in your recommendations.`;

// ===== Model Configuration =====

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp", // or "gemini-1.5-flash"
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
});

// ===== Tool Definition =====

const generateRoadmap = tool(
    async ({ resumeText }: { resumeText: string }) => {
        // In a real implementation, this could:
        // - Parse the resume for skills, experience, education
        // - Query a database of job requirements
        // - Generate personalized recommendations
        
        return {
            resumeText,
            message: "Resume analyzed successfully. Generating roadmap...",
        };
    },
    {
        name: "generateRoadmap",
        description:
            "Analyze parsed resume text and generate a future career roadmap with skills assessment, role recommendations, learning path, and action plan",
        schema: z.object({
            resumeText: z.string().describe("Full parsed resume text containing education, experience, skills, and projects"),
        }),
    }
);

// ===== State Management =====

const MessagesState = Annotation.Root({
    ...MessagesAnnotation.spec,
    llmCalls: Annotation<number>({
        reducer: (x, y) => x + y,
        default: () => 0,
    }),
});

type StateType = typeof MessagesState.State;

// ===== Graph Nodes =====

const llmWithTools = model.bindTools([generateRoadmap]);

async function llmCall(state: StateType): Promise<Partial<StateType>> {
    const response = await llmWithTools.invoke([
        new SystemMessage(CAREER_SYSTEM_PROMPT),
        ...state.messages,
    ]);

    return {
        messages: [response],
        llmCalls: 1,
    };
}

const toolsByName: Record<string, typeof generateRoadmap> = {
    generateRoadmap,
};

async function toolNode(state: StateType): Promise<Partial<StateType>> {
    const lastMessage = state.messages[state.messages.length - 1];

    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
        return { messages: [] };
    }

    const results = [];

    for (const toolCall of lastMessage.tool_calls ?? []) {
        const tool = toolsByName[toolCall.name];
        if (tool) {
            const observation = await tool.invoke(toolCall);
            results.push(observation);
        }
    }

    return { messages: results };
}

async function shouldContinue(state: StateType): Promise<"toolNode" | typeof END> {
    const lastMessage = state.messages[state.messages.length - 1];

    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
        return END;
    }

    if (lastMessage.tool_calls?.length) {
        return "toolNode";
    }

    return END;
}

// ===== Agent Compilation =====

const agent = new StateGraph(MessagesState)
    .addNode("llmCall", llmCall)
    .addNode("toolNode", toolNode)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
    .addEdge("toolNode", "llmCall")
    .compile();

// ===== Main Execution Function =====

export async function generateCareerRoadmap(
    parsedPdf: ParsedPdfContent
): Promise<StateType> {
    const result = await agent.invoke({
        messages: [
            {
                role: "user",
                content: `Here is the parsed resume data:

${parsedPdf.content.fullText}

Generate a comprehensive future career roadmap including:
- Candidate profile with strengths and gaps
- Recommended roles with match scores
- Phased learning roadmap
- Project suggestions
- 90-day action plan`,
            },
        ],
    });

    // Log messages for debugging
    for (const message of result.messages) {
        if ('_getType' in message) {
            const type = message._getType();
            const content = 'content' in message ? message.content : '';
            console.log(`[${type}]: ${content}`);
        }
    }

    return result;
}

// ===== Example Usage =====

export async function main() {
    // Example parsed PDF data
    const exampleParsedPdf: ParsedPdfContent = {
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
Junior Developer at ABC Corp (2022-2024)
- Developed web applications using React
- Collaborated with team of 5 developers
- Fixed bugs and implemented new features

PROJECTS
- E-commerce website using MERN stack
- Weather app with React and OpenWeather API
            `,
        },
    };

    try {
        const result = await generateCareerRoadmap(exampleParsedPdf);
        console.log("\n✅ Career roadmap generated successfully!");
        console.log(`Total LLM calls: ${result.llmCalls}`);
    } catch (error) {
        console.error("❌ Error generating roadmap:", error);
    }
}

// Uncomment to run:
// main().catch(console.error);