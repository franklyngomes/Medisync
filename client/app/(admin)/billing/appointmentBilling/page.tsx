"use client"
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import BasicTable from "../../../../components/tables/BasicTable";
import React from "react";
import Button from "../../../../components/ui/button/Button";
import { PaymentIcon, ChevronDownIcon } from "../../../../icons";
import { useModal } from "../../../../hooks/useModal";
import { Modal } from "../../../../components/ui/modal";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import { useForm, Controller } from "react-hook-form";
import { useStore } from "../../../../store/store";
import Input from "../../../../components/form/input/InputField";
import toast from "react-hot-toast";
import DatePicker from "../../../../components/form/date-picker";
import { format } from 'date-fns';
import { AppointmentBillCreateQuery, AppointmentBillDeleteQuery, AppointmentBillDetailsQuery, AppointmentBillListQuery, AppointmentBillUpdateQuery } from "../../../../api/query/billing/AppointmentBillQuery";
import { AppointmentListQuery } from "../../../../api/query/AppointmentQuery"
import Badge from "../../../../components/ui/badge/Badge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface AppointmentBillFormProps {
  appointmentId: string;
  noOfHour: number;
  discount: number;
  chargeType: string;
  source: string;
  paymentMethod: string;
  status?: string;
}
interface AppointmentBillTableItem {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  chargeType: string;
  noOfHour: number;
  standardCharge: number;
  appliedCharge: number;
  discount: number;
  tax: number;
  source: string;
  paymentMethod: string;
  date: Date;
  status?: string;
}
const AppointmentBilling = () => {
  const schema = yup.object({
    appointmentId: yup.string().required("Patient is required"),
    patientId: yup.string(),
    doctorId: yup.string(),
    chargeType: yup.string().required("Charge type is required"),
    noOfHour: yup.number().required("Hours is required"),
    standardCharge: yup.number(),
    appliedCharge: yup.number(),
    discount: yup.number(),
    tax: yup.number(),
    source: yup.string(),
    paymentMethod: yup.string().required("Payment method is required"),
    date: yup.date(),
    status: yup.string()
  });
  const [appointmentOption, setAppointmentOption] = React.useState<{ label: string; value: string }[]>([])
  const { data: appointmentList } = AppointmentListQuery()
  const appointments = appointmentList?.data?.data
  const { data } = AppointmentBillListQuery()
  const bills = data?.data?.data
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutateAsync } = AppointmentBillCreateQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = AppointmentBillDetailsQuery(editId, !!editId)
  const appointmentBillDetails = details?.data?.data
  const { mutateAsync: update } = AppointmentBillUpdateQuery()
  const { mutateAsync: deletePayment } = AppointmentBillDeleteQuery()

  const tableColumns = [
    { label: "Appointment No.", key: "appointmentId.appointmentNo" },
    {
      label: "Date", key: "date", render: (item: AppointmentBillTableItem) => item.date ? format(new Date(item.date), "dd-MM-yyyy") : "---"
    },
    { label: "Patient", key: "appointmentId.patientId.name" },
    { label: "Doctor", key: "appointmentId.doctorId.name" },
    { label: "Charge Type", key: "chargeType" },
    { label: "Standard Charge($)", key: "standardCharge" },
    { label: "No Of Hr", key: "noOfHour" },
    { label: "Applied Charge($)", key: "appliedCharge" },
    // { label: "TPA Charge", key: "tpaCharge" },
    { label: "Discount", key: "discount" },
    { label: "Tax(%)", key: "tax" },
    { label: "Amount($)", key: "amount" },
    {
      label: "Status",
      key: "status",
      render: (item: AppointmentBillTableItem) => (
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
  ]
  const chargeTypeOptions = [
    {
      label: "Consultation",
      value: "consultation",
    },
    {
      label: "Surgery",
      value: "surgery"
    }
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
  const sourceOptions = [
    {
      label: "Online",
      value: "Online",
    },
    {
      label: "Offline",
      value: "Offline"
    },
  ]
  const paymentOptions = [
    {
      label: "UPI",
      value: "UPI",
    },
    {
      label: "Cash",
      value: "Cash",
    },
    {
      label: "Card",
      value: "Card",
    },
  ]
  const onSubmit = (data: AppointmentBillFormProps) => {
    const { appointmentId, noOfHour, chargeType, source, paymentMethod } = data
    const formdata = new FormData()
    formdata.append("appointmentId", appointmentId)
    formdata.append("noOfHour", String(noOfHour))
    formdata.append("discount", String(noOfHour))
    formdata.append("chargeType", chargeType)
    formdata.append("source", source)
    formdata.append("paymentMethod", paymentMethod)
    mutateAsync(formdata, {
      onSuccess: () => {
        reset()
        closeModal()
      }
    })
  }
  const onUpdate = (data: AppointmentBillFormProps) => {
    const { chargeType, noOfHour, discount, status, source, paymentMethod } = data;

    const payload = {
      chargeType, noOfHour, discount, status, source, paymentMethod
    };
    update({ editId, payload }, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          closeModal()
          setIsEditing(false)
        } else {
          toast.error(res?.response?.data.message)
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
  }, [isEditing, openModal])

  // useEffect to reset form values when editing
  React.useEffect(() => {
    if (isEditing && appointmentBillDetails) {
      reset({
        appointmentId: appointmentBillDetails.appointmentId?.appointmentNo,
        chargeType: appointmentBillDetails.chargeType,
        standardCharge: appointmentBillDetails.standardCharge,
        noOfHour: appointmentBillDetails.noOfHour,
        discount: appointmentBillDetails.discount,
        status: appointmentBillDetails.status,
        source: appointmentBillDetails?.source,
        paymentMethod: appointmentBillDetails.paymentMethod,
        date: appointmentBillDetails?.date ? new Date(appointmentBillDetails.date) : undefined,
      });
    } else {
      reset({
        appointmentId: "",
        chargeType: "",
        standardCharge: undefined,
        discount: undefined,
        status: "",
        source: "",
        paymentMethod: "",
        date: undefined,
      })
    }
  }, [isEditing, appointmentBillDetails, reset]);

  React.useEffect(() => {
    if (appointments && Array.isArray(appointments)) {
      setAppointmentOption(appointments.map((item) => ({ label: item?.appointmentNo || item.patientId.name, value: item._id })));
    }
  }, [appointments])
  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Appointment Billing" breadCrumbTitle="Appointment Billing" />
          <Button size="sm" variant="primary" startIcon={<PaymentIcon />} onClick={openModal}>
            New Bill
          </Button>
        </div>
        <div className="space-y-6">
          <BasicTable data={bills} tableColumns={tableColumns} onDelete={onDelete} billOption={true} billType="appointment" />
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
              {!isEditing ? "Add new bill" : "Edit Bill"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={isEditing ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>{!isEditing ? "Select Appointment" : "Appointment No"}</Label>
                    <div className="relative">
                      {!isEditing ?
                        <>
                          <Controller
                            control={control}
                            name="appointmentId"
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={appointmentOption}
                                placeholder="Select Appointment"
                                className="dark:bg-dark-900"
                              />
                            )}
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                          </span>
                        </>
                        : <Input value={appointmentBillDetails ? appointmentBillDetails.appointmentId?.appointmentNo : ""} disabled />}
                    </div>
                    {errors.appointmentId && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.appointmentId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>No of hours</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="noOfHour"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="number"
                          />
                        )}
                      />
                    </div>
                    {errors.noOfHour && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.noOfHour.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Charge Type</Label>
                    <div className="relative">
                      <>
                        <Controller
                          control={control}
                          name="chargeType"
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value ?? ""}
                              options={chargeTypeOptions}
                              placeholder="Select charge Type"
                              className="dark:bg-dark-900"
                            />
                          )}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </>
                    </div>
                    {errors.chargeType && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.chargeType.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Source</Label>
                    <div className="relative">
                      <>
                        <Controller
                          control={control}
                          name="source"
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value ?? ""}
                              options={sourceOptions}
                              placeholder="Select source"
                              className="dark:bg-dark-900"
                            />
                          )}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </>
                    </div>
                    {errors.source && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.source.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Payment Methods</Label>
                    <div className="relative">
                      <>
                        <Controller
                          control={control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value ?? ""}
                              options={paymentOptions}
                              placeholder="Select method"
                              className="dark:bg-dark-900"
                            />
                          )}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </>
                    </div>
                    {errors.paymentMethod && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Discount($)</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="discount"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="number"
                          />
                        )}
                      />
                    </div>
                    {errors.discount && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.discount.message}
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
                      {errors.status && (
                        <p style={{ color: "red", margin: "0", padding: "5px" }}>
                          {errors.status.message}
                        </p>
                      )}
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
                            onChange={(selectedDate) => {
                              if (selectedDate) {
                                onChange(selectedDate.toISOString()); // store ISO string in form state
                              }
                            }}
                          />
                        )}
                      />
                      {errors.date && (
                        <p style={{ color: "red", margin: "0", padding: "5px" }}>
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                  }
                </div>
              </div>
            </div>
            {isEditing &&
              <div className="mt-3">
                <Label>Total payable amount</Label>
                <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  ${isEditing ? appointmentBillDetails?.amount : ""}
                </h4>
              </div>
            }
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

export default AppointmentBilling