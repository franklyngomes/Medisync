const express = require('express')
const PatientController = require('../controller/PatientController')
const DoctorController = require('../controller/DoctorController')
const ImageUpload = require('../helper/ImageUpload')
const router = express.Router()
const multer = require('multer')
const AppointmentController = require('../controller/AppointmentController')
const upload = multer()

//Patient Routes
router.post('/patient-create',upload.none(), PatientController.CreatePatient)
router.get('/all-patients', PatientController.GetAllPatients)
router.get('/patient-details/:id', PatientController.PatientDetails)
router.post('/patient-update/:id',upload.none(), PatientController.UpdatePatient)
router.post('/patient-delete/:id', PatientController.DeletePatient)

//Doctor Routes
router.post('/doctor-create',ImageUpload.single('image'), DoctorController.CreateDoctor)
router.get('/all-doctor', DoctorController.GetAllDoctors)
router.get('/doctor-details/:id', DoctorController.DoctorDetails)
router.post('/doctor-update/:id',ImageUpload.single('image'), DoctorController.UpdateDoctor)
router.post('/doctor-delete/:id',DoctorController.DeleteDoctor)

//Appointment Routes
router.post('/appointment-create',upload.none(), AppointmentController.CreateAppointment)
router.get('/all-appointment', AppointmentController.GetAllAppointment)
router.get('/appointment-details/:id', AppointmentController.AppointmentDetails)
module.exports = router