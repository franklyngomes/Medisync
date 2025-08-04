const express  = require('express')
const router = express.Router()
const {generateReport, renderHtml} = require('../../services/ReportService')
const HttpCode = require('../helper/HttpCode')

router.post('/generate', async(req, res) => {
  const {billType, billData} = req.body
  try {
    const reportPath = await generateReport(billType, billData)
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

router.post('/preview', async (req, res) => {
  const { billType, billData } = req.body;

  try {
    const html = await renderHtml(billType, billData, { autoPrint: true });
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Failed to render preview: ${error.message}`);
  }
});
module.exports = router