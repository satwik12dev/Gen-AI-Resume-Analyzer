const express = require("express")
const interviewRouter = express.Router()
const authMiddleware = require("../middleware/auth.middleware")
const interviewControler = require("../controllers/interview.controller")
const upload =  require("../middleware/file.middleware")

/**
 * @route POST /api/interview
 * @desc Generate interview report based on resume, self-description and job description
 * @access Private
 * @body {resume: String, selfDescription: String, jobDescription: String}
 * @returns {matchScore: Number, technicalQuestions: [{question:String, answer:String, intention:String}], behavioralQuestions: [{question:String, answer:String, intention:String}], skillGaps: [{skill:String, severity:"low"|"medium"|"high"}], preparationPlan: [{day:Number, focus:String, tasks:[String]}]}
 */
interviewRouter.post("/",authMiddleware.authUser, upload.single("resume"),interviewControler.generateInterviewReportController);


module.exports = interviewRouter