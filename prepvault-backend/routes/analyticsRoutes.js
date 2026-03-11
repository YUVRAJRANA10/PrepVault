const express = require('express')
const router = express.Router()
const { getCommonQuestions, getDifficultySummary } = require('../controllers/analyticsController')

router.get('/common-questions/:company', getCommonQuestions)
router.get('/difficulty-summary', getDifficultySummary)
module.exports = router