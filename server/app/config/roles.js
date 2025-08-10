const ROLES= {
  ADMIN: "Admin",
  RECEPTIONIST: "Receptionist",
  DOCTOR: "Doctor",
  LABSTAFF: "LabStaff"
}

const ROLE_PERMISSIONS={
  [ROLES.ADMIN]: [
    "create_user",
    "create_patient", "read_patient", "update_patient", "delete_patient",
    "create_appointment", "read_appointment", "update_appointment", "delete_appointment",
    "create_doctor", "read_doctor", "update_doctor", "delete_doctor",
    "create_room", "read_room", "update_room", "delete_room",
    "create_room", "read_room", "update_room", "delete_room",
    "create_pathology_test", "read_pathology_test", "update_pathology_test", "delete_pathology_test",
    "create_radiology_test", "read_radiology_test", "update_radiology_test", "delete_radiology_test",
    "create_invoice", "read_invoice","update_invoice", "delete_invoice","user_profile"
  ],
  [ROLES.RECEPTIONIST]: [
    "create_patient", "update_patient","read_patient",
    "create_appointment", "update_appointment","read_appointment",
    "read_doctor","read_invoice","user_profile"
  ],
  [ROLES.DOCTOR]: [
    "create_appointment", "read_appointment", "update_appointment","read_patient",
    "update_patient","user_profile"
  ],
  [ROLES.LABSTAFF]: [
    "create_pathology_test", "read_pathology_test", "update_pathology_test",
    "create_radiology_test", "read_radiology_test", "update_radiology_test","create_invoice","user_profile"
  ]
}
module.exports = {ROLES, ROLE_PERMISSIONS}