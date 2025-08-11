"use client"
import { AppointmentCreateQuery, AppointmentDeleteQuery, AppointmentDetailsQuery, AppointmentGroupQuery, AppointmentListQuery, AppointmentUpdateQuery } from "../../../api/query/AppointmentQuery";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BasicTable from "../../../components/tables/BasicTable";
import React from "react";
import Button from "../../../components/ui/button/Button";
import { AppointmentIcon, ChevronDownIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import TextArea from "../../../components/form/input/TextArea";
import Select from "../../../components/form/Select";
import DatePicker from "../../../components/form/date-picker";
import { PatientListQuery } from "../../../api/query/PatientQuery";
import { DoctorListQuery } from "../../../api/query/DoctorQuery";
import { useForm, Controller } from "react-hook-form";
import Badge from "../../../components/ui/badge/Badge";
import { format } from 'date-fns';
import { useStore } from "../../../store/store";
import Input from "../../../components/form/input/InputField";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


const Appointment = () => {
  const schema = yup.object({
    patientId: yup.string().required("Patient is required"),
    doctorId: yup.string().required("Doctor is required"),
    appointmentDate: yup.date().required("Appointment Date is required"),
    note: yup.string().required("Note is required").max(35),
    status: yup.string()
  });
  const [patientOption, setPatientOption] = React.useState<{ label: string; value: string }[]>([])
  const [doctorOption, setDoctorOption] = React.useState<{ label: string, value: string }[]>([])
  const { data } = AppointmentListQuery()
  const appointments = data?.data?.data
  const { data: patientsList } = PatientListQuery()
  const patients = patientsList?.data.data
  const { data: doctorList } = DoctorListQuery()
  const doctors = doctorList?.data.data
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutateAsync } = AppointmentCreateQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = AppointmentDetailsQuery(editId, !!editId)
  const appointmentDetails = details?.data.data
  const { mutateAsync: update } = AppointmentUpdateQuery()
  const { mutateAsync: deleteAppointment } = AppointmentDeleteQuery()
  const { user } = useStore()
  const doctorId = (user?.role === "Doctor" ? user?.doctorId : "")
  const {data: doctorAppointment} = AppointmentGroupQuery(doctorId, !!doctorId)
  const specificAppointments = doctorAppointment?.data?.data

  type Patient = {
  _id: string;
  name: string;
};

type Doctor = {
  _id: string;
  name: string;
};

type AppointmentType = {
  _id: string;
  appointmentNo: string;
  patientId: Patient;
  doctorId: Doctor;
  appointmentDate: Date;
  note: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};
type AppointmentFormData = {
  patientId?: string;
  doctorId?: string;
  appointmentDate: Date;
  note: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

  const tableColumns = [
    { label: "Appointment No.", key: "appointmentNo" },
    { label: "Patient Name", key:`${user?.role === "Doctor" ? "patient.name" :"patientId.name"}` },
    { label: "Note", key: "note" },
    { label: "Doctor Name", key: `${user?.role === "Doctor"? "doctor.name" : "doctorId.name"}` },
    {
      label: "Appointment Date",
      render: (item: AppointmentType) => format(new Date(item.appointmentDate), "dd-MM-yyyy")
    },
    {
      label: "Appointment Time",
      render: (item: AppointmentType) =>
        new Date(item.appointmentDate).toLocaleTimeString('en-IN', {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        })
    }
    ,
    {
      label: "Status",
      key: "status",
      render: (item: AppointmentType) => (
        <Badge
          size="sm"
          color={
            item.status === "Scheduled"
              ? "warning"
              : item.status === "Completed"
                ? "success"
                : "error"
          }
        >
          {item.status}
        </Badge>
      )
    },
  ]
  const statusOptions = [
    {
      label: "Scheduled",
      value: "Scheduled",
    },
    {
      label: "Completed",
      value: "Completed"
    },
    {
      label: "Cancelled",
      value: "Cancelled"
    }
  ]
  const onSubmit = (data: AppointmentFormData) => {
    const { patientId, doctorId, appointmentDate, note } = data
    const formdata = new FormData()
    formdata.append("patientId", patientId)
    formdata.append("doctorId", doctorId)
    formdata.append("appointmentDate", appointmentDate.toISOString())
    formdata.append("note", note)
    mutateAsync(formdata, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          closeModal()
          reset()
        } else {
          toast.error(res?.response?.data?.message)
        }
      }
    })
  }
  const onUpdate = (data: AppointmentFormData) => {
    const { note, status, appointmentDate } = data
    const formdata = new FormData()
    formdata.append("note", note)
    formdata.append("status", status)
    formdata.append("appointmentDate", appointmentDate.toISOString())
    update({ editId, formdata }, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          closeModal()
          setIsEditing(false)
        } else {
          toast.error(res?.response?.data?.message)
        }
      }
    })
  }
  const onDelete = (id: string) => {
    deleteAppointment(id, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          closeModal()
          setIsEditing(false)
        } else {
          toast.error(res?.response?.data?.message)
        }
      }
    })
  }
  React.useEffect(() => {
    if (patients && Array.isArray(patients)) {
      setPatientOption(patients.map((patient) => ({ label: patient.name, value: patient._id })));
    }
    if (doctors && Array.isArray(doctors)) {
      setDoctorOption(doctors.map((item) => ({ label: `Dr. ${item.name}`, value: item._id })))
    }
  }, [patients, doctors])

  React.useEffect(() => {
    if (isEditing) {
      openModal()
    }
  }, [isEditing, openModal])

  // useEffect to reset form values when editing
  React.useEffect(() => {
    if (isEditing && appointmentDetails) {
      reset({
        patientId: appointmentDetails.patientId._id,
        doctorId: appointmentDetails.doctorId._id,
        status: appointmentDetails.status,
        appointmentDate: appointmentDetails?.appointmentDate
          ? new Date(appointmentDetails.appointmentDate)
          : undefined,
        note: appointmentDetails.note,
      });
    } else {
      reset({
        appointmentDate: undefined,
        note: "",
        status: "",
        patientId: "",
        doctorId: "",
      })
    }
  }, [isEditing, appointmentDetails, reset]);

  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Appointment List" breadCrumbTitle="Appointments" />
          <Button size="sm" variant="primary" startIcon={<AppointmentIcon />} onClick={openModal}>
            Create Appointment
          </Button>
        </div>
        <div className="space-y-6">
          <BasicTable data={user?.role === "Doctor" ? specificAppointments : appointments} tableColumns={tableColumns} onDelete={onDelete}/>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => {
        setIsEditing(false)
        closeModal()
        reset()
      }} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-5 dark:bg-gray-900">
          <div className="px-2 pr-14">
            <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {!isEditing ? "Create New Appointment" : "Update Appointment"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={isEditing ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
            {
              isEditing &&
              <div className="flex justify-between items-center my-5 px-3">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Appointment Status
                </h5>
                <Badge
                  size="sm"
                  color={
                    appointmentDetails?.status === "Scheduled"
                      ? "warning"
                      : appointmentDetails?.status === "Completed"
                        ? "success"
                        : "error"
                  }
                >
                  {appointmentDetails?.status}
                </Badge>
              </div>
            }
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
                        : <Input value={appointmentDetails?.patientId.name ?? ""} disabled />}
                    </div>
                    {errors.patientId && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.patientId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    {
                      user?.role !== "Doctor" ?
                        <>
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
                              : <Input value={appointmentDetails?.doctorId.name ?? ""} disabled />
                            }
                          </div>
                        </>
                        :
                        <>
                          <Label>Dr. {user.firstName} {user.lastName}</Label>
                          <Input value={user?.doctorId} disabled />
                        </>
                    }
                    {errors.doctorId && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.doctorId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="appointmentDate"
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          id="date-picker"
                          label="Appointment Date"
                          placeholder="Select a date"
                          defaultDate={value ? new Date(value) : undefined} // this ensures default is shown
                          onChange={(selectedDate) => {
                            if (selectedDate) {
                              onChange(selectedDate.toISOString()); // store ISO string in form state
                            }
                          }}
                        />
                      )}
                    />
                    {errors.appointmentDate && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.appointmentDate.message}
                      </p>
                    )}
                  </div>
                  {isEditing &&
                    <div>
                      <Label>Change Status</Label>
                      <div className="relative">
                        <>
                          <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                              <Select
                                {...field}
                                value={field.value ?? ""}
                                options={statusOptions}
                                placeholder="Select Status"
                                className="dark:bg-dark-900"
                              />
                            )}
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                          </span>
                        </>
                      </div>
                    </div>
                  }
                </div>
                <div className="mt-5">
                  <Label>Note</Label>
                  <Controller
                    control={control}
                    name="note"
                    render={({ field }) => (
                      <TextArea {...field} />
                    )}
                  />
                  {errors.note && (
                    <p style={{ color: "red", margin: "0", padding: "5px" }}>
                      {errors.note.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={() => {
                setIsEditing(false)
                closeModal()
                reset()
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

export default Appointment
