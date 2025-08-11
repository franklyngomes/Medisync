"use client"
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BasicTable from "../../../components/tables/BasicTable";
import React from "react";
import Button from "../../../components/ui/button/Button";
import { PatientIcon, ChevronDownIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { useForm, Controller } from "react-hook-form";
import { useStore } from "../../../store/store";
import Input from "../../../components/form/input/InputField";
import toast from "react-hot-toast";
import { CreatePatientQuery, PatientDeleteQuery, PatientDetailsQuery, PatientListQuery, PatientUpdateQuery } from "../../../api/query/PatientQuery";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface PatientFormProps {
  name: string;
  gender: string;
  age: number;
  bloodType: string;
  address: string;
  phone: string;
}


const Patient = () => {
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const schema = yup.object({
    name: yup.string().required("Name is required"),
    gender: yup.string().required("Gender is required"),
    age: yup.number().required("Age is required"),
    bloodType: yup.string().required("Blood Type is required"),
    address: yup.string().required("Note is required").max(50),
    phone: yup.string()
      .required("Phone number required")
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, "too short")
      .max(10, "too long"),
  });
  const { data } = PatientListQuery()
  const patients = data?.data?.data
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const { mutateAsync } = CreatePatientQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = PatientDetailsQuery(editId, !!editId)
  const patientDetails = details?.data?.data
  const { mutateAsync: update } = PatientUpdateQuery()
  const { mutateAsync: deletePatient } = PatientDeleteQuery()

  const tableColumns = [
    { label: "Name", key: "name" },
    { label: "Gender", key: "gender" },
    {
      label: "Age", key: "age"
    },
    { label: "Blood Type", key: "bloodType" },
    { label: "Address", key: "address" },
    { label: "Phone", key: "phone" },
  ]

  const GenderOptions = [
    {
      label: "Male",
      value: "Male",
    },
    {
      label: "Female",
      value: "Female"
    },
    {
      label: "Others",
      value: "Others"
    }
  ]
  const bloodType = [
    {
      label: "A+",
      value: "A+",
    },
    {
      label: "A-",
      value: "A-",
    },
    {
      label: "B+",
      value: "B+",
    },
    {
      label: "B-",
      value: "B-",
    },
    {
      label: "O+",
      value: "O+",
    },
    {
      label: "O-",
      value: "O-",
    },
    {
      label: "AB+",
      value: "AB+",
    },
    {
      label: "AB-",
      value: "AB-",
    },

  ]
  const onSubmit = (data: PatientFormProps) => {
    const { name, gender, age, bloodType, address, phone } = data
    const formdata = new FormData()
    formdata.append("name", name)
    formdata.append("gender", gender)
    formdata.append("age", String(age))
    formdata.append("bloodType", bloodType)
    formdata.append("address", address)
    formdata.append("phone", phone)
    mutateAsync(formdata, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          closeModal()
          reset()
        } else {
          toast.error(res?.reponse?.data?.message)
        }
      }
    })
  }
  const onUpdate = (data: PatientFormProps) => {
    const { name, gender, age, bloodType, address, phone } = data
    const formData = new FormData()
    formData.append("name", name)
    formData.append("gender", gender)
    formData.append("age", age)
    formData.append("bloodType", bloodType)
    formData.append("address", address)
    formData.append("phone", phone)
    update({ editId, formData }, {
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
    deletePatient(id, {
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
    if (isEditing && patientDetails) {
      reset({
        name: patientDetails?.name,
        gender: patientDetails?.gender,
        age: patientDetails?.age,
        bloodType: patientDetails?.bloodType,
        address: patientDetails?.address,
        phone: patientDetails?.phone
      });
    } else {
      reset({
        name: "",
        gender: "",
        age: undefined,
        bloodType: "",
        address: "",
        phone: ""
      })
    }
  }, [isEditing, patientDetails, reset, closeModal]);

  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Patient List" breadCrumbTitle="Patients" />
          <Button size="sm" variant="primary" startIcon={<PatientIcon />} onClick={openModal}>
            Add new Patient
          </Button>
        </div>
        <div className="space-y-6">
          <ComponentCard title="Patients">
            <BasicTable data={patients} tableColumns={tableColumns} onDelete={onDelete} />
          </ComponentCard>
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
              {!isEditing ? "Add new patient" : "Edit patient"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={isEditing ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Name</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                      {errors.name && (
                        <p style={{ color: "red", margin: "0", padding: "5px" }}>
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="age"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="number"
                          />
                        )}
                      />
                      {errors.age && (
                        <p style={{ color: "red", margin: "0", padding: "5px" }}>
                          {errors.age.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="gender"
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value ?? ""}
                            options={GenderOptions}
                            placeholder="Select Gender"
                            className="dark:bg-dark-900"
                          />
                        )}
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                    {errors.gender && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Blood Type</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="bloodType"
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value ?? ""}
                            options={bloodType}
                            placeholder="Select Blood Type"
                            className="dark:bg-dark-900"
                          />
                        )}
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                    {errors.bloodType && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.bloodType.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Address</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="address"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                      {errors.address && (
                        <p style={{ color: "red", margin: "0", padding: "5px" }}>
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                    </div>
                    {errors.phone && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
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

export default Patient