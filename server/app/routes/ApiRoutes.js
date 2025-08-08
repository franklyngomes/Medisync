const express = require('express')
const UserController = require('../controller/UserController')
const PatientController = require('../controller/PatientController')
const DoctorController = require('../controller/DoctorController')
const AppointmentController = require('../controller/AppointmentController')
const RoomController = require('../controller/RoomController')
const InPatientController = require('../controller/InPatientController')
const OutpatientController = require('../controller/OutpatientController')
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
const CheckPermissions = require('../middleware/CheckPermissions')
const {AuthCheck} = require('../middleware/Auth')

//Patient Routes
router.post('/patient-create',AuthCheck,CheckPermissions(["create_patient"]),upload.none(), PatientController.CreatePatient)
router.get('/all-patients',AuthCheck,CheckPermissions(["read_patient"]), PatientController.GetAllPatients)
router.get('/patient-details/:id',AuthCheck,CheckPermissions(["read_patient"]), PatientController.PatientDetails)
router.post('/patient-update/:id',AuthCheck,CheckPermissions(["update_patient"]),upload.none(), PatientController.UpdatePatient)
router.post('/patient-delete/:id',AuthCheck,CheckPermissions(["delete_patient"]), PatientController.DeletePatient)

//Doctor Routes
router.post('/doctor-create',AuthCheck,CheckPermissions(["create_doctor"]),DoctorImageUpload.single('image'), DoctorController.CreateDoctor)
router.get('/all-doctor', AuthCheck,CheckPermissions(["read_doctor"]),DoctorController.GetAllDoctors)
router.get('/doctor-details/:id', AuthCheck,CheckPermissions(["read_doctor"]),DoctorController.DoctorDetails)
router.post('/doctor-update/:id',AuthCheck,CheckPermissions(["update_doctor"]),DoctorImageUpload.single('image'), DoctorController.UpdateDoctor)
router.post('/doctor-delete/:id',AuthCheck,CheckPermissions(["delete_doctor"]),DoctorController.DeleteDoctor)

//Appointment Routes
router.post('/appointment-create',AuthCheck,CheckPermissions(["create_appointment"]),upload.none(), AppointmentController.CreateAppointment)
router.get('/all-appointment', AuthCheck,CheckPermissions(["read_appointment"]),AppointmentController.GetAllAppointment)
router.get('/appointment-details/:id', AuthCheck,CheckPermissions(["read_appointment"]),AppointmentController.AppointmentDetails)
router.post('/appointment-update/:id',AuthCheck,CheckPermissions(["update_appointment"]),upload.none(), AppointmentController.UpdateAppointment)
router.post('/appointment-delete/:id', AuthCheck,CheckPermissions(["delete_appointment"]),AppointmentController.DeleteAppointment)

//Room Routes
router.post('/room-create',AuthCheck,CheckPermissions(["create_room"]),upload.none(),RoomController.CreateRoom)
router.get('/all-room', AuthCheck,CheckPermissions(["read_room"]),RoomController.GetAllRooms)
router.get('/room-details/:id',AuthCheck,CheckPermissions(["read_room"]), RoomController.RoomDetails)
router.post('/room-update/:id', AuthCheck,CheckPermissions(["update_room"]),upload.none(), RoomController.UpdateRoom)
router.post('/room-delete/:id',AuthCheck,CheckPermissions(["delete_room"]), RoomController.DeleteRoom)

//InPatient Routes
router.post('/inpatient-create',upload.none(), InPatientController.CreateInPatient)
router.get('/all-inpatient', InPatientController.GetAllInPatient)
router.get('/inpatient-details/:id', InPatientController.InPatientDetails)
router.post('/inpatient-update/:id', upload.none(), InPatientController.UpdateInPatient)
router.post('/inpatient-delete/:id', InPatientController.DeleteInPatient)

//OutPatient Routes
router.post('/outpatient-create',upload.none(), OutpatientController.CreateOutPatient)
router.get('/all-outpatient', OutpatientController.GetAllOutPatient)
router.get('/outpatient-details/:id', OutpatientController.OutPatientDetails)
router.post('/outpatient-update/:id', upload.none(), OutpatientController.UpdateOutPatient)
router.delete('/outpatient-delete/:id', OutpatientController.DeleteOutPatient)

//PathologyTest Routes
router.post('/pathology-test-create', AuthCheck,CheckPermissions(["create_pathology_test"]),upload.none(), PathologyTestController.CreatePathologyTest)
router.get('/all-pathology-test', AuthCheck,CheckPermissions(["read_pathology_test"]),PathologyTestController.GetAllPathologyTest)
router.get('/pathology-test-details/:id', AuthCheck,CheckPermissions(["read_pathology_test"]),PathologyTestController.PathologyTestDetails)
router.post('/pathology-test-update/:id', AuthCheck,CheckPermissions(["update_pathology_test"]),upload.none(), PathologyTestController.UpdatePathologyTest)
router.post('/pathology-test-delete/:id', AuthCheck,CheckPermissions(["delete_pathology_test"]),PathologyTestController.DeletePathologyTest)

//RadiologyTest Routes
router.post('/radiology-test-create', AuthCheck,CheckPermissions(["create_radiology_test"]),upload.none(), RadiologyTestController.CreateRadiologyTest)
router.get('/all-radiology-test', AuthCheck,CheckPermissions(["read_radiology_test"]),RadiologyTestController.GetAllRadiologyTest)
router.get('/radiology-test-details/:id', AuthCheck,CheckPermissions(["read_radiology_test"]),RadiologyTestController.RadiologyTestDetails)
router.post('/radiology-test-update/:id', AuthCheck,CheckPermissions(["update_radiology_test"]),upload.none(), RadiologyTestController.UpdateRadiologyTest)
router.post('/radiology-test-delete/:id', AuthCheck,CheckPermissions(["delete_radiology_test"]),RadiologyTestController.DeleteRadiologyTest)

//AppointmentBill Routes
router.post('/appointment-bill-create', AuthCheck,CheckPermissions(["create_invoice"]),upload.none(), AppointmentBillController.CreateAppointmentBill)
router.get('/all-appointment-bill', AuthCheck,CheckPermissions(["read_invoice"]),AppointmentBillController.GetAllAppointmentBills)
router.get('/appointment-bill-details/:id', AuthCheck,CheckPermissions(["read_invoice"]),AppointmentBillController.AppointmentBillDetails)
router.post('/appointment-bill-update/:id', AuthCheck,CheckPermissions(["update_invoice"]),AppointmentBillController.UpdateAppointmentBill)
router.delete('/appointment-bill-delete/:id', AuthCheck,CheckPermissions(["delete_invoice"]),AppointmentBillController.DeleteAppointmentBill)

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
router.post('/pathology-bill-create', AuthCheck,CheckPermissions(["create_invoice"]),upload.none(), PathologyBillController.CreatePathologyBill)
router.get('/all-pathology-bill', AuthCheck,CheckPermissions(["read_invoice"]),PathologyBillController.GetAllPathologyBills)
router.get('/pathology-bill-details/:id', AuthCheck,CheckPermissions(["read_invoice"]),PathologyBillController.PathologyBillDetails)
router.post('/pathology-bill-update/:id', AuthCheck,CheckPermissions(["update_invoice"]),upload.none(), PathologyBillController.UpdatePathologyBill)
router.delete('/pathology-bill-delete/:id', AuthCheck,CheckPermissions(["delete_invoice"]),PathologyBillController.DeletePathologyBill)

//Radiology Bill Routes
router.post('/radiology-bill-create', AuthCheck,CheckPermissions(["create_invoice"]),upload.none(), RadiologyBillController.CreateRadiologyBill)
router.get('/all-radiology-bill', AuthCheck,CheckPermissions(["read_invoice"]),RadiologyBillController.GetAllRadiologyBills)
router.get('/radiology-bill-details/:id', AuthCheck,CheckPermissions(["read_invoice"]),RadiologyBillController.RadiologyBillDetails)
router.post('/radiology-bill-update/:id', AuthCheck,CheckPermissions(["update_invoice"]),upload.none(), RadiologyBillController.UpdateRadiologyBill)
router.delete('/radiology-bill-delete/:id', AuthCheck,CheckPermissions(["delete_invoice"]),RadiologyBillController.DeleteRadiologyBill)


//User Routes
router.post('/signup',AuthCheck,CheckPermissions(["create_user"]),upload.none(),UserController.Signup)
router.get('/verify-email',UserController.VerifyEmail)
router.post('/signin',upload.none(),UserController.Signin)
router.post('/forgot-password',upload.none(),UserController.forgotPassword)
router.post('/reset-password',upload.none(),UserController.resetPassword)
module.exports = router