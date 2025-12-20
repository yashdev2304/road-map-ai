import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import PDFParser from "pdf2json";
import { generateCareerRoadmap } from "./utils";

export const runtime = "nodejs";

// Helper function to parse PDF
function parsePDF(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (errData: any) => {
            reject(new Error(errData.parserError));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            resolve(pdfData);
        });

        pdfParser.loadPDF(filePath);
    });
}

export async function POST(req: NextRequest) {
    let tempFilePath: string | null = null;

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file uploaded" },
                { status: 400 }
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { success: false, message: "Only PDF files are allowed" },
                { status: 400 }
            );
        }

        // Create temp directory if it doesn't exist
        const tempDir = path.join(process.cwd(), "temp");
        if (!existsSync(tempDir)) {
            await mkdir(tempDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `pdf_${timestamp}_${randomString}.pdf`;
        tempFilePath = path.join(tempDir, fileName);

        // Save file to temp directory
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await writeFile(tempFilePath, buffer);

        // Parse PDF
        const pdfData = await parsePDF(tempFilePath);

        // Extract text from all pages
        let fullText = "";
        const pages: { pageNumber: number; text: string }[] = [];

        if (pdfData.Pages) {
            pdfData.Pages.forEach((page: any, index: number) => {
                let pageText = "";
                if (page.Texts) {
                    page.Texts.forEach((text: any) => {
                        if (text.R) {
                            text.R.forEach((r: any) => {
                                if (r.T) {
                                    pageText += decodeURIComponent(r.T) + " ";
                                }
                            });
                        }
                    });
                }
                pages.push({
                    pageNumber: index + 1,
                    text: pageText.trim(),
                });
                fullText += pageText + "\n\n";
            });
        }

        // Delete the temporary file
        await unlink(tempFilePath);
        tempFilePath = null;

        const roadmap = await generateCareerRoadmap({ content: { fullText } });
        return NextResponse.json({
            success: true,
            metadata: {
                fileName: file.name,
                fileSize: file.size,
                totalPages: pdfData.Pages?.length || 0,
            },
            content: {
                fullText: fullText.trim(),
                pages,
                roadmap
            },
        });
    } catch (error: any) {
        // Cleanup: Delete temp file if it exists
        if (tempFilePath && existsSync(tempFilePath)) {
            try {
                await unlink(tempFilePath);
            } catch (cleanupError) {
                console.error("Failed to cleanup temp file:", cleanupError);
            }
        }

        console.error("PDF parsing error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to parse PDF",
                error: error.message,
            },
            { status: 500 }
        );
    }
}