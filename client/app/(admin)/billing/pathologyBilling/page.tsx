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
import { PathologyBillCreateQuery, PathologyBillListQuery, PathologyBillDetailsQuery, PathologyBillUpdateQuery, PathologyBillDeleteQuery } from "../../../../api/query/billing/PathologyBillingQuery"
import Badge from "../../../../components/ui/badge/Badge";
import { PatientListQuery } from "../../../../api/query/PatientQuery";
import { DoctorListQuery } from "../../../../api/query/DoctorQuery";
import { PathologyTestListQuery } from "../../../../api/query/PathologyTestQuery";


const PathologyBilling = () => {
  const [patientOption, setPatientOption] = React.useState<{ label: string; value: string }[]>([])
  const [doctorOption, setDoctorOption] = React.useState<{ label: string; value: string }[]>([])
  const [testOption, setTestOption] = React.useState<{ label: string; value: string }[]>([])
  const { data: patientList } = PatientListQuery()
  const { data: doctorList } = DoctorListQuery()
  const { data: testDetails } = PathologyTestListQuery()
  const patients = patientList?.data?.data
  const doctors = doctorList?.data?.data
  const tests = testDetails?.data?.data
  const { data: pathologyBills } = PathologyBillListQuery()
  const bills = pathologyBills?.data?.data
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control } = useForm();
  const { mutateAsync } = PathologyBillCreateQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = PathologyBillDetailsQuery(editId, !!editId)
  const pathologyBillDetails = details?.data?.data
  const { mutateAsync: update } = PathologyBillUpdateQuery()
  const { mutateAsync: deletePayment } = PathologyBillDeleteQuery()

  const tableColumns = [
    { label: "Bill No.", key: "billNo" },
    {
      label: "Date", key: "date", render: (item: any) => item.date ? format(new Date(item.date), "dd-MM-yyyy") : "---"
    },
    { label: "Patient", key: "patientId.name" },
    { label: "Reference Doctor", key: "referenceDoctor.name" },
    { label: "Test Name", key: "testId.testName" },
    { label: "Charge(₹)", key: "testId.charge" },
    { label: "Tax(%)", key: "tax" },
    { label: "Discount", key: "discount" },
    { label: "Amount(₹)", key: "amount" },
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
  const onSubmit = (data: any) => {
    const { testId, patientId,referenceDoctor, discount,source, paymentMethod} = data
    const formdata = new FormData()
    formdata.append("testId", testId)
    formdata.append("patientId", patientId)
    formdata.append("referenceDoctor", referenceDoctor)
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
    const { testId, chargeType, discount, status, source, paymentMethod } = data;

    const payload = {
      testId, chargeType, discount, status, source, paymentMethod
    };
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
    if (isEditing) {
      openModal()
    }
  }, [isEditing])

  // useEffect to reset form values when editing
  React.useEffect(() => {
    if (isEditing && pathologyBillDetails) {

      reset({
        billNo: pathologyBillDetails.billNo,
        patientId: pathologyBillDetails.patientId._id,
        testId: pathologyBillDetails.testId._id,
        referenceDoctor: pathologyBillDetails.referenceDoctor._id,
        discount: pathologyBillDetails.discount,
        status: pathologyBillDetails.status,
        source: pathologyBillDetails?.source,
        paymentMethod: pathologyBillDetails.paymentMethod,
        tax: pathologyBillDetails.tax,
        date: pathologyBillDetails?.date ? new Date(pathologyBillDetails.date) : null,
      });
    } else {
      reset({
        billNo: "",
        patientId: "",
        testId: "",
        referenceDoctor: "",
        discount: "",
        status: "",
        source: "",
        paymentMethod: "",
        tax: "",
        date: null,
      })
    }
  }, [isEditing, pathologyBillDetails, reset]);

  React.useEffect(() => {
    if (patients && Array.isArray(patients)) {
      setPatientOption(patients.map((item) => ({ label: item?.name, value: item._id })));
    }
    if (doctors && Array.isArray(doctors)) {
      setDoctorOption(doctors.map((item) => ({ label: `Dr. ${item?.name}`, value: item._id })));
    }
    if (tests && Array.isArray(tests)) {
      setTestOption(tests.map((item) => ({ label: item.testName, value: item._id })));
    }
  }, [patients, doctors, tests])
  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Pathology Billing" breadCrumbTitle="" />
          <Button size="sm" variant="primary" startIcon={<PaymentIcon />} onClick={openModal}>
            New Bill
          </Button>
        </div>
        <div className="space-y-6">
          <BasicTable data={bills} tableColumns={tableColumns} onDelete={onDelete} />
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
                    <Label>{!isEditing ? "Select Patient" : "Patient No/Name"}</Label>
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
                        : <Input value={pathologyBillDetails ? pathologyBillDetails.patientId?.name : ""} disabled />}
                    </div>
                  </div>
                  <div>
                    <Label>{!isEditing ? "Select Doctor" : "Doctor"}</Label>
                    <div className="relative">
                      {!isEditing ?
                        <>
                          <Controller
                            control={control}
                            name="referenceDoctor"
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
                        : <Input value={pathologyBillDetails ? pathologyBillDetails.referenceDoctor?.name : ""} disabled />}
                    </div>
                  </div>
                  <div>
                    <Label>{!isEditing ? "Select Test" : "Test Name"}</Label>
                    <div className="relative">
                      {!isEditing ?
                        <>
                          <Controller
                            control={control}
                            name="testId"
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={testOption}
                                placeholder="Select Test"
                                className="dark:bg-dark-900"
                              />
                            )}
                          />
                          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon />
                          </span>
                        </>
                        : <Input value={pathologyBillDetails ? pathologyBillDetails?.testId?.testName : ""} disabled />}
                    </div>
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
            {isEditing &&
              <div className="mt-3">
                <Label>Total payable amount</Label>
                <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
                  ${isEditing ? pathologyBillDetails?.amount : ""}
                </h4>
              </div>
            }
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

export default PathologyBilling