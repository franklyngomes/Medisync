"use client"
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BasicTable from "../../../components/tables/BasicTable";
import React from "react";
import Button from "../../../components/ui/button/Button";
import { PaymentIcon, ChevronDownIcon } from "../../../icons";
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
import { PatientListQuery } from "../../../api/query/PatientQuery";
import { CreatePaymentsQuery, PaymentDeleteQuery, PaymentDetailsQuery, PaymentListQuery, PaymentUpdateQuery } from "../../../api/query/PaymentQuery";
import { DoctorListQuery } from "../../../api/query/DoctorQuery";
import Badge from "../../../components/ui/badge/Badge";


const Payment = () => {
  const [patientOption, setPatientOption] = React.useState<{ label: string; value: string }[]>([])
  const { data: patientsList } = PatientListQuery()
  const [doctorOption, setDoctorOption] = React.useState<{ label: string, value: string }[]>([])
  const { data: doctorList } = DoctorListQuery()
  const doctors = doctorList?.data.data
  const patients = patientsList?.data.data
  const { data } = PaymentListQuery()
  const payments = data?.data?.data
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control } = useForm();
  const { mutateAsync } = CreatePaymentsQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = PaymentDetailsQuery(editId, !!editId)
  const paymentDetails = details?.data.data
  const { mutateAsync: update } = PaymentUpdateQuery()
  const { mutateAsync: deletePayment } = PaymentDeleteQuery()

  const tableColumns = [
    { label: "Patient Name", key: "patientId.name" },
    { label: "Doctor Name", key: "doctorId.name" },
    { label: "Note", key: "notes" },
    { label: "Amount", key: "amount" },
    {
      label: "Status",
      key: "status",
      render: (item: any) => (
        <Badge
          size="sm"
          color={
            item.status === "Pending"
              ? "warning"
              : item.status === "Paid"
                ? "success"
                : "error"
          }
        >
          {item.status}
        </Badge>
      )
    },
    {
      label: "Date", key: "date", render: (item: any) => item.date ? format(new Date(item.date), "dd-MM-yyyy") : "---"
    },
  ]

  const statusOptions = [
    {
      label: "Paid",
      value: "Paid",
    },
    {
      label: "Pending",
      value: "Pending"
    },
    {
      label: "Failed",
      value: "Failed"
    }
  ]
  const onSubmit = (data: any) => {
    const { patientId, doctorId, notes, amount } = data
    const formdata = new FormData()
    formdata.append("patientId", patientId)
    formdata.append("doctorId", doctorId)
    formdata.append("notes", notes)
    formdata.append("amount", amount)
    mutateAsync(formdata, {
      onSuccess: () => {
        reset()
        closeModal()
      }
    })
  }
  const onUpdate = (data: any) => {
    const { notes, amount, status, date } = data
    const formData = new FormData()
    formData.append("notes", notes)
    formData.append("amount", amount)
    formData.append("status", status)
    formData.append("date", date)
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
    deletePayment(id, {
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
    if (isEditing && paymentDetails) {
      reset({
        patientId: paymentDetails.patientId,
        doctorId: paymentDetails.doctorId,
        notes: paymentDetails.notes,
        amount: paymentDetails.amount,
        status: paymentDetails.status,
        date: paymentDetails?.date ? new Date(paymentDetails.date) : null,
      });
    } else {
      reset({
        patientId: "",
        doctorId: "",
        notes: "",
        amount: "",
        status: "",
        date: null,
      })
    }
  }, [isEditing, paymentDetails, reset]);
  React.useEffect(() => {
    if (patients && Array.isArray(patients)) {
      setPatientOption(patients.map((patient) => ({ label: patient.name, value: patient._id })));
    }
    if (doctors && Array.isArray(doctors)) {
      setDoctorOption(doctors.map((item) => ({ label: item.name, value: item._id })))
    }
  }, [patients, doctors])
  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Payment List" breadCrumbTitle="Payment" />
          <Button size="sm" variant="primary" startIcon={<PaymentIcon />} onClick={openModal}>
            Add New Payment
          </Button>
        </div>
        <div className="space-y-6">
          <ComponentCard title="Payments">
            <BasicTable data={payments} tableColumns={tableColumns} onDelete={onDelete} />
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
              {!isEditing ? "Add new payment" : "Edit payment"}
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
                        : <Input value={paymentDetails?.patientId.name ?? ""} disabled />}
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
                        : <Input value={paymentDetails?.doctorId.name ?? ""} disabled />}
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="notes"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="amount"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="number"
                          />
                        )}
                      />
                    </div>
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
                  {isEditing &&
                    <div>
                      <Controller
                        control={control}
                        name="date"
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            id="date-picker"
                            label="Date"
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
                  }
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

export default Payment