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
import { RadiologyBillListQuery, RadiologyBillCreateQuery, RadiologyBillDetailsQuery, RadiologyBillUpdateQuery, RadiologyBillDeleteQuery } from "../../../../api/query/billing/RadiologyBillQuery"
import Badge from "../../../../components/ui/badge/Badge";
import { PatientListQuery } from "../../../../api/query/PatientQuery";
import { DoctorListQuery } from "../../../../api/query/DoctorQuery";
import { RadiologyTestListQuery } from "../../../../api/query/RadiologyTestQuery";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface RadiologyBillFormProps {
  patientId: string;
  testId: string
  referenceDoctor: string;
  discount: number;
  source: string;
  paymentMethod: string;
  status?:string;
}
interface RadiologyBillTableItem {
  billNo: string;
  patientId: string;
  testId: string
  referenceDoctor: string;
  charge: number;
  discount: number;
  tax: number;
  source: string;
  paymentMethod: string;
  date: Date;
  status?: string;
}
const RadiologyBilling = () => {
  const schema = yup.object({
    billNo: yup.string(),
    patientId: yup.string().required("Patient is required"),
    testId: yup.string().required("Test is required"),
    referenceDoctor: yup.string().required("Doctor is required"),
    discount: yup.number(),
    tax: yup.number(),
    source: yup.string(),
    paymentMethod: yup.string().required("Payment method is required"),
    date: yup.date(),
    status: yup.string()
  });
  const [patientOption, setPatientOption] = React.useState<{ label: string; value: string }[]>([])
  const [doctorOption, setDoctorOption] = React.useState<{ label: string; value: string }[]>([])
  const [testOption, setTestOption] = React.useState<{ label: string; value: string }[]>([])
  const { data: patientList } = PatientListQuery()
  const { data: doctorList } = DoctorListQuery()
  const { data: testDetails } = RadiologyTestListQuery()
  const patients = patientList?.data?.data
  const doctors = doctorList?.data?.data
  const tests = testDetails?.data?.data
  const { data: radiologyBills } = RadiologyBillListQuery()
  const bills = radiologyBills?.data?.data
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutateAsync } = RadiologyBillCreateQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = RadiologyBillDetailsQuery(editId, !!editId)
  const radiologyBillDetails = details?.data?.data
  const { mutateAsync: update } = RadiologyBillUpdateQuery()
  const { mutateAsync: deletePayment } = RadiologyBillDeleteQuery()

  const tableColumns = [
    { label: "Bill No.", key: "billNo" },
    {
      label: "Date", key: "date", render: (item: RadiologyBillTableItem) => item.date ? format(new Date(item.date), "dd-MM-yyyy") : "---"
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
      render: (item: RadiologyBillTableItem) => (
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
  const onSubmit = (data: RadiologyBillFormProps) => {
    const { testId, patientId, referenceDoctor, discount, source, paymentMethod } = data
    const formdata = new FormData()
    formdata.append("testId", testId)
    formdata.append("patientId", patientId)
    formdata.append("referenceDoctor", referenceDoctor)
    formdata.append("discount", String(discount))
    formdata.append("source", source)
    formdata.append("paymentMethod", paymentMethod)
    mutateAsync(formdata, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          closeModal()
        } else {
          toast.error(res?.response?.data.message)
        }
      }
    })
  }
  const onUpdate = (data: RadiologyBillFormProps) => {
    const { testId, discount, status, source, paymentMethod } = data;

    const payload = {
      testId, discount, status, source, paymentMethod
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

  React.useEffect(() => {
    if (isEditing) {
      openModal()
    }
  }, [isEditing,openModal])

  // useEffect to reset form values when editing
  React.useEffect(() => {
    if (isEditing && radiologyBillDetails) {

      reset({
        billNo: radiologyBillDetails.billNo,
        patientId: radiologyBillDetails.patientId._id,
        testId: radiologyBillDetails.testId._id,
        referenceDoctor: radiologyBillDetails.referenceDoctor._id,
        discount: radiologyBillDetails.discount,
        status: radiologyBillDetails.status,
        source: radiologyBillDetails?.source,
        paymentMethod: radiologyBillDetails.paymentMethod,
        tax: radiologyBillDetails.tax,
        date: radiologyBillDetails?.date ? new Date(radiologyBillDetails.date) : undefined,
      });
    } else {
      reset({
        billNo: "",
        patientId: "",
        testId: "",
        referenceDoctor: "",
        discount: undefined,
        status: "",
        source: "",
        paymentMethod: "",
        tax: undefined,
        date: undefined,
      })
    }
  }, [isEditing, radiologyBillDetails, reset]);

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
          <PageBreadcrumb pageTitle="Radiology Billing" breadCrumbTitle="" />
          <Button size="sm" variant="primary" startIcon={<PaymentIcon />} onClick={openModal}>
            New Bill
          </Button>
        </div>
        <div className="space-y-6">
          <BasicTable data={bills} tableColumns={tableColumns} onDelete={onDelete} billType="radiology" billOption={true} />
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
                        : <Input value={radiologyBillDetails ? radiologyBillDetails.patientId?.name : ""} disabled />}
                    </div>
                    {errors.patientId && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.patientId.message}
                      </p>
                    )}
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
                        : <Input value={radiologyBillDetails ? radiologyBillDetails.referenceDoctor?.name : ""} disabled />}
                    </div>
                    {errors.referenceDoctor && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.referenceDoctor.message}
                      </p>
                    )}
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
                        : <Input value={radiologyBillDetails ? radiologyBillDetails?.testId?.testName : ""} disabled />}
                    </div>
                    {errors.testId && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.testId.message}
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
                    {errors.source && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.source.message}
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
                  ${isEditing ? radiologyBillDetails?.amount : ""}
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

export default RadiologyBilling