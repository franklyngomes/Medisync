const express  = require('express')
const router = express.Router()
const {generateReport, renderHtml} = require('../../services/ReportService')
const HttpCode = require('../helper/HttpCode')
const AppointmentBillingModel = require('../model/billing/AppointmentBillingModel')
const PathologyBillingModel = require('../model/billing/PathologyBillingModel')
const RadiologyBillingModel = require('../model/billing/RadiologyBillingModel')

router.post('/generate', async(req, res) => {
  const {billType, billData} = req.body
  try {
    const reportPath = await generateReport(billType, billData)
    if(billType === "appointment"){
      const appointmentBillDetails = await AppointmentBillingModel.findById(billData._id)
      appointmentBillDetails.invoice = reportPath
      await appointmentBillDetails.save()
    }
    if(billType === "pathology"){
      const pathologyBillDetails = await PathologyBillingModel.findById(billData._id)
      pathologyBillDetails.invoice = reportPath
      await pathologyBillDetails.save()
    }
    if(billType === "radiology"){
      const radiologyBillDetails = await RadiologyBillingModel.findById(billData._id)
      radiologyBillDetails.invoice = reportPath
      await radiologyBillDetails.save()
    }
    return res.status(HttpCode.success).json({
      status: true,
      message: "Invoice generated",
      reportPath
    })
  } catch (error) {
    return res.status(HttpCode.serverError).json({
      status: false,
      message: error.message
    })
  }
})
router.get('/print/:filename', (req, res) => {
  const {filename} = req.params
  const pdfPath = `/invoices/${filename}`
  const fullUrl = `${req.protocol}://${req.get("host")}${pdfPath}`;

  res.send(`
    <html>
      <body style="margin:0">
        <embed src="${fullUrl}" type="application/pdf" width="100%" height="100%" />
        <script>
          window.onload = function() {
            setTimeout(() => window.print(), 500);
          }
        </script>
      </body>
    </html>
    `)
})

module.exports = router