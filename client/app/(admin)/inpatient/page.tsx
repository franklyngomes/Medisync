"use client"
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BasicTable from "../../../components/tables/BasicTable";
import React from "react";
import Button from "../../../components/ui/button/Button";
import { InpatientIcon, ChevronDownIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { useForm, Controller } from "react-hook-form";
import { useStore } from "../../../store/store";
import Input from "../../../components/form/input/InputField";
import toast from "react-hot-toast";
import DatePicker from "../../../components/form/date-picker";
import { format } from 'date-fns';
import { CreateInPatientQuery, InPatientDeleteQuery, InPatientDetailsQuery, InPatientListQuery, InPatientUpdateQuery } from "../../../api/query/InPatientQuery";
import { AllRoomQuery } from "../../../api/query/RoomQuery";
import { PatientListQuery } from "../../../api/query/PatientQuery";
import { DoctorListQuery } from "../../../api/query/DoctorQuery";


const InPatient = () => {
  const [patientOption, setPatientOption] = React.useState<{ label: string; value: string }[]>([])
  const { data: patientsList } = PatientListQuery()
  const [roomOption, setRoomOption] = React.useState<{ label: string; value: string }[]>([])
  const { data: roomList } = AllRoomQuery()
  const [doctorOption, setDoctorOption] = React.useState<{ label: string, value: string }[]>([])
  const { data: doctorList } = DoctorListQuery()
  const doctors = doctorList?.data.data
  const rooms = roomList?.data.data
  const patients = patientsList?.data.data
  const { data } = InPatientListQuery()
  const inPatients = data?.data?.data
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control } = useForm();
  const { mutateAsync } = CreateInPatientQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = InPatientDetailsQuery(editId, !!editId)
  const inPatientDetails = details?.data.data
  console.log(inPatientDetails)
  const { mutateAsync: update } = InPatientUpdateQuery()
  const { mutateAsync: deleteInPatient } = InPatientDeleteQuery()

  const tableColumns = [
    { label: "Patient Name", key: "patientId.name" },
    {
      label: "Room", key: "roomId.roomNo", render: (item: any) => {
        const room = item.roomId
        return room ? `${room.roomNo} - ${room.roomName} ` : "---"
      }
    },
    { label: "Doctor Name", key: "doctorId.name" },
    {
      label: "Admission Date", key: "admissionDate", render: (item: any) => format(new Date(item.admissionDate), "dd-MM-yyyy")
    },
    { label: "Discharge Date", key: "dischargeDate", render: (item: any) => item.dischargeDate ? format(new Date(item.dischargeDate), "dd-MM-yyyy") : "---" },
    { label: "Diagnosis", key: "diagnosis" },
  ]
  const onSubmit = (data: any) => {
    const { patientId, doctorId, roomId, admissionDate, diagnosis } = data
    const formdata = new FormData()
    formdata.append("patientId", patientId)
    formdata.append("roomId", roomId)
    formdata.append("doctorId", doctorId)
    formdata.append("admissionDate", admissionDate)
    formdata.append("diagnosis", diagnosis)
    mutateAsync(formdata, {
      onSuccess: () => {
        reset()
        closeModal()
      }
    })
  }
  const onUpdate = (data: any) => {
    const { roomId, admissionDate, dischargeDate, diagnosis } = data
    const formData = new FormData()
    formData.append("roomId", roomId)
    formData.append("admissionDate", admissionDate)
    formData.append("dischargeDate", dischargeDate)
    formData.append("diagnosis", diagnosis)
    update({ editId, formData }, {
      onSuccess: (res) => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          closeModal()
          setIsEditing(false)
        } else {
          toast.error(res.data.message)
        }
      }
    })
  }
  const onDelete = (id: string) => {
    deleteInPatient(id, {
      onSuccess: (res) => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          closeModal()
          setIsEditing(false)
        } else {
          toast.error(res.data.message)
        }
      }
    })
  }

  React.useEffect(() => {
    if (isEditing) {
      openModal()
    }
  }, [isEditing])

  // useEffect to reset form values when editing
  React.useEffect(() => {
    if (isEditing && inPatientDetails) {
      reset({
        patientId: inPatientDetails.patientId,
        doctorId: inPatientDetails.doctorId,
        roomId: inPatientDetails?.roomId._id,
        admissionDate: inPatientDetails?.admissionDate ? new Date(inPatientDetails.admissionDate) : null,
        dischargeDate: inPatientDetails?.dischargeDate ? new Date(inPatientDetails.dischargeDate) : null,
        diagnosis: inPatientDetails.diagnosis,
      });
    } else {
      reset({
        patientId: "",
        doctorId: "",
        roomId: "",
        admissionDate: null,
        dischargeDate: null,
        diagnosis: "",
      })
    }
  }, [isEditing, inPatientDetails, reset]);
  React.useEffect(() => {
    if (patients && Array.isArray(patients)) {
      setPatientOption(patients.map((patient) => ({ label: patient.name, value: patient._id })));
    }
    if (rooms && Array.isArray(rooms)) {
      setRoomOption(rooms.map((room) => ({ label: `${room.roomNo} - ${room.roomName}`, value: room._id })));
    }
    if (doctors && Array.isArray(doctors)) {
      setDoctorOption(doctors.map((item) => ({ label: item.name, value: item._id })))
    }
  }, [patients, rooms, doctors])
  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Inpatient List" breadCrumbTitle="Inpatients" />
          <Button size="sm" variant="primary" startIcon={<InpatientIcon />} onClick={openModal}>
            Add New Inpatient
          </Button>
        </div>
        <div className="space-y-6">
          <ComponentCard title="Inpatients">
            <BasicTable data={inPatients} tableColumns={tableColumns} onDelete={onDelete} />
          </ComponentCard>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => {
        setIsEditing(false)
        closeModal()
      }} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-5 dark:bg-gray-900">
          <div className="px-2 pr-14">
            <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {!isEditing ? "Add new inpatient" : "Edit inpatient"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={isEditing ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>{!isEditing ? "Select Patient" : "Patient Name"}</Label>
                    <div className="relative">
                      {!isEditing ?
                        <>
                          <Controller
                            control={control}
                            name="patientId"
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={patientOption}
                                placeholder="Select Patient"
                                className="dark:bg-dark-900"
                              />
                            )}
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                          </span>
                        </>
                        : <Input value={inPatientDetails?.patientId.name ?? ""} disabled />}
                    </div>
                  </div>
                  <div>
                    <Label>{!isEditing ? "Select Doctor" : "Doctor Name"}</Label>
                    <div className="relative">
                      {!isEditing ?
                        <>
                          <Controller
                            control={control}
                            name="doctorId"
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={doctorOption}
                                placeholder="Select Doctor"
                                className="dark:bg-dark-900"
                              />
                            )}
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                          </span>
                        </>
                        : <Input value={inPatientDetails?.doctorId.name ?? ""} disabled />}
                    </div>
                  </div>
                  <div>
                    <Label>{!isEditing ? "Select Room" : "Room No"}</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="roomId"
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={roomOption}
                            placeholder="Select Room"
                            className="dark:bg-dark-900"
                          />
                        )}
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="admissionDate"
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          id="date-picker"
                          label="Admission Date"
                          placeholder="Select a date"
                          defaultDate={value ? new Date(value) : undefined} // this ensures default is shown
                          onChange={([selectedDate]) => {
                            if (selectedDate) {
                              onChange(selectedDate.toISOString()); // store ISO string in form state
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="dischargeDate"
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          id="date-picker"
                          label="Discharge Date"
                          placeholder="Select a date"
                          defaultDate={value ? new Date(value) : undefined} // this ensures default is shown
                          onChange={([selectedDate]) => {
                            if (selectedDate) {
                              onChange(selectedDate.toISOString()); // store ISO string in form state
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Label>Diagnosis</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="diagnosis"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={() => {
                setIsEditing(false)
                closeModal()
              }}>
                Cancel
              </Button>
              <Button size="sm" type="submit">
                {isEditing ? "Save" : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default InPatient