"use client"
import ComponentCard from "../../../../components/common/ComponentCard";
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
import Badge from "../../../../components/ui/badge/Badge";
import { OutpatientBillListQuery, OutpatientBillCreateQuery, OutpatientBillDetailsQuery, OutpatientBillUpdateQuery, OutpatientBillDeleteQuery } from "../../../../api/query/billing/OutPatientBillQuery"
import { OutPatientListQuery } from "../../../../api/query/OutPatientQuery";
import { format } from "date-fns";



const OPDBilling = () => {
  const [outPatientOption, setOutPatientOption] = React.useState<{ label: string; value: string }[]>([])
  const { data: outpatientsList } = OutPatientListQuery()
  const outpatients = outpatientsList?.data.data
  const { data } = OutpatientBillListQuery()
  const outpatientBillList = data?.data?.data
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control } = useForm();
  const { mutateAsync } = OutpatientBillCreateQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = OutpatientBillDetailsQuery(editId, !!editId)
  const outpatientDetails = details?.data?.data
  const { mutateAsync: update } = OutpatientBillUpdateQuery()
  const { mutateAsync: deletePayment } = OutpatientBillDeleteQuery()
  console.log(outpatientDetails)

  const tableColumns = [
    {
      label: "Date", key: "date", render: (item: any) => item.date ? format(new Date(item.date), "dd-mm-yyyy") : "---"
    },
    { label: "Patient", key: "outPatientId.patientId.name" },
    { label: "Charge Name", key: "chargeName" },
    { label: "Charge Type", key: "chargeType" },
    { label: "No of Hr", key: "noOfHour" },
    { label: "Source", key: "source" },
    { label: "Standard Charge", key: "standardCharge" },
    { label: "Applied Charge", key: "appliedCharge" },
    { label: "TPA", key: "tpaCharge" },
    { label: "Discount", key: "discount" },
    { label: "Tax", key: "tax" },
    { label: "Amount", key: "amount" },
    { label: "Payment Method", key: "paymentMethod" },
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
  const onSubmit = (data: any) => {
    const { outPatientId, chargeName, chargeType, noOfHour, tpaCharge,discount, source, paymentMethod } = data
    const formdata = new FormData()
    formdata.append("outPatientId", outPatientId)
    formdata.append("chargeName", chargeName)
    formdata.append("chargeType", chargeType)
    formdata.append("noOfHour", noOfHour)
    formdata.append("tpaCharge", tpaCharge)
    formdata.append("discount", discount)
    formdata.append("source", source)
    formdata.append("paymentMethod", paymentMethod)
    mutateAsync(formdata, {
      onSuccess: () => {
        reset()
        closeModal()
      }
    })
  }
  const onUpdate = (data: any) => {
    const { tax, standardCharge, noOfHour, discount, status } = data
    const formData = new FormData()
    formData.append("tax", tax)
    formData.append("noOfHour", noOfHour)
    formData.append("discount", discount)
    formData.append("status", status)
    const payload = { tax, standardCharge, noOfHour, discount, status }
    update({ editId, payload }, {
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
    if (outpatients && Array.isArray(outpatients)) {
      setOutPatientOption(outpatients.map((item) => ({ label: item.patientId.name, value: item._id })))
    }
  }, [outpatients])
  React.useEffect(() => {
    if (isEditing) {
      openModal()
    }
  }, [isEditing])

  // useEffect to reset form values when editing
  React.useEffect(() => {
    if (isEditing && outpatientDetails) {
      reset({
        outPatientId: outpatientDetails._id,
        chargeName: outpatientDetails.chargeName,
        chargeType: outpatientDetails.chargeType,
        noOfHour: outpatientDetails.noOfHour,
        source: outpatientDetails.source,
        standardCharge: outpatientDetails.standardCharge,
        appliedCharge: outpatientDetails.appliedCharge,
        tpaCharge: outpatientDetails.tpaCharge,
        discount: outpatientDetails.discount,
        tax: outpatientDetails.tax,
        amount: outpatientDetails.amount,
        paymentMethod: outpatientDetails.paymentMethod,
        status: outpatientDetails.status,
        date: outpatientDetails?.date ? new Date(outpatientDetails.date) : null,
      });
    } else {
      reset({
        outPatientId: "",
        chargeName: "",
        chargeType: "",
        noOfHour: "",
        source: "",
        standardCharge: "",
        appliedCharge: "",
        tpaCharge: "",
        discount: "",
        tax: "",
        amount: "",
        paymentMethod: "",
        status: "",
        date: null,
      })
    }
  }, [isEditing, outpatientDetails, reset]);
  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="OPD Billing" breadCrumbTitle="" />
          <Button size="sm" variant="primary" startIcon={<PaymentIcon />} onClick={openModal}>
            New Bill
          </Button>
        </div>
        <div className="space-y-6">
          <BasicTable data={outpatientBillList} tableColumns={tableColumns} onDelete={onDelete} />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => {
        setIsEditing(false)
        closeModal()
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
                    <Label>{!isEditing ? "Select Out Patient" : "Out Patient Name"}</Label>
                    <div className="relative">
                      {!isEditing ?
                        <>
                          <Controller
                            control={control}
                            name="outPatientId"
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={outPatientOption}
                                placeholder="Select Out Patient"
                                className="dark:bg-dark-900"
                              />
                            )}
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                          </span>
                        </>
                        : <Input value={outpatientDetails?.outPatientId.patientId?.name ?? ""} disabled />}
                    </div>
                  </div>
                  <div>
                    <Label>Charge Name</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="chargeName"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Charge Type</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="chargeType"
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value ?? ""}
                            options={chargeTypeOptions}
                            placeholder="Select Charge Type"
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
                    <Label>No of Hrs</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="noOfHour"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="text"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Source</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="source"
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value ?? ""}
                            options={sourceOptions}
                            placeholder="Select Source"
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
                    <Label>TPA Charge</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="tpaCharge"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="text"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Discount</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="discount"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="text"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value ?? ""}
                            options={paymentOptions}
                            placeholder="Select Method"
                            className="dark:bg-dark-900"
                          />
                        )}
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                  {isEditing &&
                    <div>
                      <Label>Change Status</Label>
                      <div className="relative">
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
                            onChange={(selectedDate) => {
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

export default OPDBilling