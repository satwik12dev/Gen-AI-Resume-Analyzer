const axios = require("axios");
const { z } = require("zod");
require("dotenv").config();

/* =========================
   SCHEMA (unchanged)
========================= */
const interviewReportSchema = z.object({
  matchScore: z.number(),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      intention: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      intention: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),

  jobDescription: z.string().optional(),
  resume: z.string().optional(),
  selfDescription: z.string().optional(),
});

/* =========================
   JSON EXTRACTOR
========================= */
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found");
  return match[0];
}

/* =========================
   MAIN FUNCTION
========================= */
async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
  preparationPlan = [],
  skillGaps = []
}) {
  try {
    const prompt = `You are an expert interviewer and career coach.
                    STRICT RULES:
                    - Return ONLY valid JSON
                    - No explanation
                    - No markdown
                    - No extra text
                    - Do NOT include resume/jobDescription in output

========================
GENERATE COMPLETE OUTPUT
========================

                    1. matchScore (0–100)

                    2. technicalQuestions (MIN 5)
                    - question
                    - answer
                    - intention

                    3. behavioralQuestions (MIN 3)

                    4. skillGaps (MIN 3)

                    5. preparationPlan (EXACTLY 7 DAYS)

========================
OUTPUT FORMAT
========================

                    {
                      "matchScore": number,
                      "technicalQuestions": [
                        {
                          "question": "",
                          "answer": "",
                          "intention": ""
                        }
                      ],
                      "behavioralQuestions": [
                        {
                          "question": "",
                          "answer": "",
                          "intention": ""
                        }
                      ],
                      "skillGaps": [
                        {
                          "skill": "",
                          "severity": "low|medium|high"
                        }
                      ],
                      "preparationPlan": [
                        {
                          "day": 1,
                          "focus": "",
                          "tasks": ["", "", ""]
                        }
                      ]
                    }

========================
INPUT DATA
========================

                      Resume:
                      ${resume}

                      Self Description:
                      ${selfDescription}

                      Job Description:
                      ${jobDescription}
`;
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "mistral",
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.2,
      },
    });

    let raw = response.data.response;

    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    raw = extractJSON(raw);
    
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON:", raw);
      throw new Error("Failed to parse AI response");
    }
    const validated = interviewReportSchema.parse(parsed);
    console.log(JSON.stringify(validated, null, 2));

    return validated;
  } catch (error) {
    console.error("Ollama Error:", error.message);
  }
}
module.exports = { generateInterviewReport };