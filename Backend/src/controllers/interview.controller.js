const pdfParseLib = require("pdf-parse");
const pdfParse = pdfParseLib.default || pdfParseLib;

const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
  try {
    console.log("API HIT");

    // ✅ check file
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    // ✅ FIXED PDF PARSING (importa
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();

    console.log("Resume parsed");

    // ✅ body
    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        message: "selfDescription and jobDescription are required",
      });
    }

    // ✅ AI call (Ollama now)
    const interviewReportbyAI = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    if (!interviewReportbyAI) {
      return res.status(500).json({
        message: "AI generation failed",
      });
    }

    console.log("AI response received");

    // ✅ DB save (UNCHANGED)
    const interviewReport = await interviewReportModel.create({
      user: req.user?.id || "test-user",
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportbyAI,
    });

    console.log("Saved to DB");

    // ✅ response
    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });

  } catch (error) {
    console.error("❌ Error:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  generateInterviewReportController,
};