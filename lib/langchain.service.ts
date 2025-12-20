import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export async function getBriefInformation(pdfContent: {
    fullText: string;
    metadata: {
        fileName: string;
        fileSize: number;
        totalPages: number;
    };
}) {
    // Initialize the model
    const model = new ChatAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: "claude-3-5-sonnet-20241022",
        temperature: 0,
    });

    // Create a prompt template
    const prompt = ChatPromptTemplate.fromMessages([
        [
            "system",
            "You are a helpful assistant that summarizes PDF documents. Provide a brief, concise summary focusing on the key points and main topics.",
        ],
        [
            "user",
            `Please analyze this PDF document and provide a brief summary.

Document Name: {fileName}
Total Pages: {totalPages}

Content:
{content}

Please provide:
1. A brief summary (2-3 sentences)
2. Main topics covered
3. Key points or highlights`,
        ],
    ]);

    // Create the chain
    const chain = prompt.pipe(model);

    // Invoke the chain
    const response = await chain.invoke({
        fileName: pdfContent.metadata.fileName,
        totalPages: pdfContent.metadata.totalPages,
        content: pdfContent.fullText.slice(0, 50000), // Limit to 50k chars to avoid token limits
    });

    return response.content;
}