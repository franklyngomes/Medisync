const express = require('express')
const PatientController = require('../controller/PatientController')
const router = express.Router()
const multer = require('multer')
const upload = multer()

//Patient Routes
router.post('/patient-create',upload.none(), PatientController.CreatePatient)
router.get('/all-patients', PatientController.GetAllPatients)
router.get('/patient-details/:id', PatientController.PatientDetails)
router.post('/patient-update/:id',upload.none(), PatientController.UpdatePatient)
router.post('/patient-delete/:id', PatientController.DeletePatient)
module.exports = router