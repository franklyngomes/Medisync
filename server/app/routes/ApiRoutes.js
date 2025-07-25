const express = require('express')
const UserController = require('../controller/UserController')
const PatientController = require('../controller/PatientController')
const DoctorController = require('../controller/DoctorController')
const AppointmentController = require('../controller/AppointmentController')
const RoomController = require('../controller/RoomController')
const InPatientController = require('../controller/InPatientController')
// const PaymentController = require('../controller/PaymentController')
const DoctorImageUpload = require('../helper/DoctorImageUpload')
const UserImageUpload = require('../helper/UserImageUpload')
const router = express.Router()
const multer = require('multer')
const upload = multer()

//Patient Routes
router.post('/patient-create',upload.none(), PatientController.CreatePatient)
router.get('/all-patients', PatientController.GetAllPatients)
router.get('/patient-details/:id', PatientController.PatientDetails)
router.post('/patient-update/:id',upload.none(), PatientController.UpdatePatient)
router.post('/patient-delete/:id', PatientController.DeletePatient)

//Doctor Routes
router.post('/doctor-create',DoctorImageUpload.single('image'), DoctorController.CreateDoctor)
router.get('/all-doctor', DoctorController.GetAllDoctors)
router.get('/doctor-details/:id', DoctorController.DoctorDetails)
router.post('/doctor-update/:id',DoctorImageUpload.single('image'), DoctorController.UpdateDoctor)
router.post('/doctor-delete/:id',DoctorController.DeleteDoctor)

//Appointment Routes
router.post('/appointment-create',upload.none(), AppointmentController.CreateAppointment)
router.get('/all-appointment', AppointmentController.GetAllAppointment)
router.get('/appointment-details/:id', AppointmentController.AppointmentDetails)
router.post('/appointment-update/:id',upload.none(), AppointmentController.UpdateAppointment)
router.post('/appointment-delete/:id', AppointmentController.DeleteAppointment)

//Room Routes
router.post('/room-create', upload.none(),RoomController.CreateRoom)
router.get('/all-room', RoomController.GetAllRooms)
router.get('/room-details/:id', RoomController.RoomDetails)
router.post('/room-update/:id', upload.none(), RoomController.UpdateRoom)
router.post('/room-delete/:id', RoomController.DeleteRoom)

//InPatient Routes
router.post('/inpatient-create', upload.none(), InPatientController.CreateInPatient)
router.get('/all-inpatient', InPatientController.GetAllInPatient)
router.get('/inpatient-details/:id', InPatientController.InPatientDetails)
router.post('/inpatient-update/:id', upload.none(), InPatientController.UpdateInPatient)
router.post('/inpatient-delete/:id', InPatientController.DeleteInPatient)

//Payment Routes
// router.post('/payment-create', upload.none(), PaymentController.CreatePayment)
// router.get('/all-payment', PaymentController.GetAllPayment)
// router.get('/payment-details/:id', PaymentController.PaymentDetails)
// router.post('/payment-update/:id', upload.none(), PaymentController.UpdatePayment)
// router.post('/payment-delete/:id', PaymentController.DeletePayment)

//User Routes
router.post('/signup', UserImageUpload.single('image'), UserController.Signup)
router.post('/verify-email',upload.none(), UserController.VerifyEmail)
router.post('/signin',upload.none(), UserController.Signin)
module.exports = router