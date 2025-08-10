export const endPoints = {
  appointments: {
    appointment_create: "/appointment-create",
    appointment_list: "/all-appointment",
    appointment_details: "/appointment-details/",
    appointment_update: "/appointment-update/",
    appointment_delete: "/appointment-delete/",
    appointment_group: "/appointment-group/"
  },
  patients: {
    patient_create: "/patient-create",
    patient_list: "/all-patients",
    patient_details: "/patient-details/",
    patient_update: "/patient-update/",
    patient_delete: "/patient-delete/"
  },
  doctors: {
    doctor_create: "/doctor-create",
    doctor_list: "/all-doctor",
    doctor_details: "/doctor-details/",
    doctor_update: "/doctor-update/",
    doctor_delete: "/doctor-delete/"
  },
  rooms: {
    room_create: "/room-create",
    room_list: "/all-room",
    room_details: "/room-details/",
    room_update: "/room-update/",
    room_delete: "/room-delete/"
  },
  inpatients: {
    inpatient_create: "/inpatient-create",
    inpatient_list: "/all-inpatient",
    inpatient_details: "/inpatient-details/",
    inpatient_update: "/inpatient-update/",
    inpatient_delete: "/inpatient-delete/"
  },
  outpatients: {
    outpatient_create: "/outpatient-create",
    outpatient_list: "/all-outpatient",
    outpatient_details: "/outpatient-details/",
    outpatient_update: "/outpatient-update/",
    outpatient_delete: "/outpatient-delete/"
  },
  pathologyTest: {
    pathologyTest_create: "/pathology-test-create",
    pathologyTest_list: "/all-pathology-test",
    pathologyTest_details: "/pathology-test-details/",
    pathologyTest_update: "/pathology-test-update/",
    pathologyTest_delete: "/pathology-test-delete/"
  },
  radiologyTest: {
    radiologyTest_create: "/radiology-test-create",
    radiologyTest_list: "/all-radiology-test",
    radiologyTest_details: "/radiology-test-details/",
    radiologyTest_update: "/radiology-test-update/",
    radiologyTest_delete: "/radiology-test-delete/"
  },
  billing: {
    appointments: {
      appointment_bill_create: "/appointment-bill-create",
      appointment_bill_list: "/all-appointment-bill",
      appointment_bill_details: "/appointment-bill-details/",
      appointment_bill_update: "/appointment-bill-update/",
      appointment_bill_delete: "/appointment-bill-delete/"
    },
    ipd: {
      ipd_bill_create: "/ipd-bill-create",
      ipd_bill_list: "/all-ipd-bill",
      ipd_bill_details: "/ipd-bill-details/",
      ipd_bill_update: "/ipd-bill-update/",
      ipd_bill_delete: "/ipd-bill-delete/"
    },
    opd: {
      opd_bill_create: "/opd-bill-create",
      opd_bill_list: "/all-opd-bill",
      opd_bill_details: "/opd-bill-details/",
      opd_bill_update: "/opd-bill-update/",
      opd_bill_delete: "/opd-bill-delete/"
    },
    pathology: {
      pathology_bill_create: "/pathology-bill-create",
      pathology_bill_list: "/all-pathology-bill",
      pathology_bill_details: "/pathology-bill-details/",
      pathology_bill_update: "/pathology-bill-update/",
      pathology_bill_delete: "/pathology-bill-delete/"
    },
    radiology: {
      radiology_bill_create: "/radiology-bill-create",
      radiology_bill_list: "/all-radiology-bill",
      radiology_bill_details: "/radiology-bill-details/",
      radiology_bill_update: "/radiology-bill-update/",
      radiology_bill_delete: "/radiology-bill-delete/"
    },

  },
  auth: {
    signup: "/signup",
    signin: "/signin",
    verify_email: "/verify-email",
    forgot_password: "/forgot-password",
    reset_password: "/reset-password"
  },
  generateBill: "/generate",
  previewBill: "/preview",
  userProfile: "/user-profile"
}