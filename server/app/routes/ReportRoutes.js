const express  = require('express')
const router = express.Router()
const GenerateReport = require('../../services/ReportService')
const HttpCode = require('../helper/HttpCode')

router.post('/generate', async(req, res) => {
  const {type, data} = req.body
  try {
    const reportPath = await GenerateReport(type, data)
    return res.status(HttpCode.success).json({
      status: true,
      message: "Invoice generated",
      reportPath
    })
  } catch (error) {
    return res.status(HttpCode.serverError).json({
      status: false,
      message: "Failed to generate invoice"
    })
  }
})
module.exports = router