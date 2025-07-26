const express = require('express')
const UserController = require('../controller/UserController')
const PatientController = require('../controller/PatientController')
const DoctorController = require('../controller/DoctorController')
const AppointmentController = require('../controller/AppointmentController')
const RoomController = require('../controller/RoomController')
const InPatientController = require('../controller/InPatientController')
const PathologyTestController = require('../controller/PathologyTestController')
const RadiologyTestController = require("../controller/RadiologyTestController")
const AppointmentBillController = require("../controller/billing/AppointmentBillingController")
const IPDBillController = require("../controller/billing/IPDBillingController")
const OPDBillController = require("../controller/billing/OPDBillingController")
const PathologyBillController = require("../controller/billing/PathologyBillingController")
const RadiologyBillController = require("../controller/billing/RadiologyBillingController")
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

//PathologyTest Routes
router.post('/pathology-test-create', upload.none(), PathologyTestController.CreatePathologyTest)
router.get('/all-pathology-test', PathologyTestController.GetAllPathologyTest)
router.get('/pathology-test-details/:id', PathologyTestController.PathologyTestDetails)
router.post('/pathology-test-update/:id', upload.none(), PathologyTestController.UpdatePathologyTest)
router.post('/pathology-test-delete/:id', PathologyTestController.DeletePathologyTest)

//RadiologyTest Routes
router.post('/radiology-test-create', upload.none(), RadiologyTestController.CreateRadiologyTest)
router.get('/all-radiology-test', RadiologyTestController.GetAllRadiologyTest)
router.get('/radiology-test-details/:id', RadiologyTestController.RadiologyTestDetails)
router.post('/radiology-test-update/:id', upload.none(), RadiologyTestController.UpdateRadiologyTest)
router.post('/radiology-test-delete/:id', RadiologyTestController.DeleteRadiologyTest)

//AppointmentBill Routes
router.post('/appointment-bill-create', upload.none(), AppointmentBillController.CreateAppointmentBill)
router.get('/all-appointment-bill', AppointmentBillController.GetAllAppointmentBills)
router.get('/appointment-bill-details/:id', AppointmentBillController.AppointmentBillDetails)
router.post('/appointment-bill-update/:id', upload.none(), AppointmentBillController.UpdateAppointmentBill)
router.post('/appointment-bill-delete/:id', AppointmentBillController.DeleteAppointmentBill)

//IPDBill Routes
router.post('/ipd-bill-create', upload.none(), IPDBillController.CreateIPDBill)
router.get('/all-ipd-bill', IPDBillController.GetAllIPDBills)
router.get('/ipd-bill-details/:id', IPDBillController.IPDBillDetails)
router.post('/ipd-bill-update/:id', upload.none(), IPDBillController.UpdateIPDBill)
router.delete('/ipd-bill-delete/:id', IPDBillController.DeleteIPDBill)

//OPDBill Routes
router.post('/opd-bill-create', upload.none(), OPDBillController.CreateOPDBill)
router.get('/all-opd-bill', OPDBillController.GetAllOPDBills)
router.get('/opd-bill-details/:id', OPDBillController.OPDBillDetails)
router.post('/opd-bill-update/:id', upload.none(), OPDBillController.UpdateOPDBill)
router.delete('/opd-bill-delete/:id', OPDBillController.DeleteOPDBill)

//Pathology Bill Routes
router.post('/pathology-bill-create', upload.none(), PathologyBillController.CreatePathologyBill)
router.get('/all-pathology-bill', PathologyBillController.GetAllPathologyBills)
router.get('/pathology-bill-details/:id', PathologyBillController.PathologyBillDetails)
router.post('/pathology-bill-update/:id', upload.none(), PathologyBillController.UpdatePathologyBill)
router.delete('/pathology-bill-delete/:id', PathologyBillController.DeletePathologyBill)

//Radiology Bill Routes
router.post('/radiology-bill-create', upload.none(), RadiologyBillController.CreateRadiologyBill)
router.get('/all-radiology-bill', RadiologyBillController.GetAllRadiologyBills)
router.get('/radiology-bill-details/:id', RadiologyBillController.RadiologyBillDetails)
router.post('/radiology-bill-update/:id', upload.none(), RadiologyBillController.UpdateRadiologyBill)
router.delete('/radiology-bill-delete/:id', PathologyBillController.DeletePathologyBill)


//User Routes
router.post('/signup', UserImageUpload.single('image'), UserController.Signup)
router.post('/verify-email',upload.none(), UserController.VerifyEmail)
router.post('/signin',upload.none(), UserController.Signin)
module.exports = router