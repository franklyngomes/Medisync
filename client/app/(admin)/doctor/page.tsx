"use client"
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BasicTable from "../../../components/tables/BasicTable";
import React from "react";
import Button from "../../../components/ui/button/Button";
import { DoctorIcon, ChevronDownIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Badge from "../../../components/ui/badge/Badge";
import { useStore } from "../../../store/store";
import Input from "../../../components/form/input/InputField";
import toast from "react-hot-toast";
import { DoctorCreateQuery, DoctorDeleteQuery, DoctorDetailsQuery, DoctorListQuery, DoctorUpdateQuery } from "../../../api/query/DoctorQuery";
import FileInput from "../../../components/form/input/FileInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface DoctorFormInputs {
  name: string;
  specialization: string;
  email: string;
  consultation: number;
  surgery: number;
  phone: string;
  image?: File | null;
  status?: string;
}

interface DoctorTableItem {
  _id: string;
  name: string;
  specialization: string;
  phone: string;
  fees: {
    consultation: number;
    surgery: number;
  };
  status: string;
  image?: string;
}

const Doctor = () => {
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const schemaWithContext = ({ isEditing }: { isEditing: boolean }) => yup.object({
    name: yup.string().required("Name is required"),
    specialization: yup.string().required("Specialization is required"),
    email: yup.string().email().required("Email is required"),
    consultation: yup.number().required("Consultation charge is required"),
    surgery: yup.number().required("Surgery charge is required"),
    phone: yup.string()
      .required("Phone number required")
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, "too short")
      .max(10, "too long"),
    image: yup.mixed().test("image-validation", "Image is required", function (value) {
      const { path, createError } = this;
      if (!isEditing) {
        if (!value) {
          return createError({ path, message: "Image is required" });
        }
        const isValidType =
          value instanceof File &&
          ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(value.type);
        if (!isValidType) {
          return createError({ path, message: "Only image files are allowed" });
        }
      }
      return true;
    }),
    status: yup.string()
  });
  const [image, setImage] = React.useState<File | null>(null)
  const { data } = DoctorListQuery()
  const doctors = data?.data?.data
  const { isOpen, openModal, closeModal } = useModal();
  const { editId, isEditing, setIsEditing } = useStore();
  const { handleSubmit, reset, control, formState: { errors } } = useForm({ resolver: yupResolver(schemaWithContext({ isEditing })) });
  const { mutateAsync } = DoctorCreateQuery()
  const { data: details } = DoctorDetailsQuery(editId, !!editId)
  const doctorDetails = details?.data?.data
  const { mutateAsync: update } = DoctorUpdateQuery()
  const { mutateAsync: deleteDoctor } = DoctorDeleteQuery()

  const tableColumns = [
    { label: "Name", key: "name" },
    { label: "Specialization", key: "specialization" },
    { label: "Phone", key: "phone" },
    { label: "Consultation Charge", key: "fees.consultation" },
    { label: "Surgery Charge", key: "fees.surgery" },
    { label: "Phone", key: "phone" },
    {
      label: "Status",
      key: "status",
      render: (item: DoctorTableItem) => (
        <Badge
          size="sm"
          color={
            item.status === "Unavailable"
              ? "warning"
              : item.status === "Available"
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
      label: "Available",
      value: "Available",
    },
    {
      label: "Unavailable",
      value: "Unavailable"
    },
    {
      label: "On Leave",
      value: "On Leave"
    }
  ]
  const specializationType = [
    {
      label: "Cardiologist",
      value: "Cardiologist",
    },
    {
      label: "Dermatologist",
      value: "Dermatologist"
    },
    {
      label: "Oncologist",
      value: "Oncologist"
    },
    {
      label: "Pediatrician",
      value: "Pediatrician"
    },
    {
      label: "Orthopaedist",
      value: "Orthopaedist"
    },
    {
      label: "Pathology",
      value: "Pathology"
    },
    {
      label: "Pulmonologist",
      value: "Pulmonologist"
    },
    {
      label: "Psychiatrist",
      value: "Psychiatrist"
    },
    {
      label: "General Surgery",
      value: "General Surgery"
    },
    {
      label: "Obstetrician-gynecologist",
      value: "Obstetrician-gynecologist"
    },
  ]
  const onSubmit: SubmitHandler<DoctorFormInputs> = (data :DoctorFormInputs) => {
    const { name, specialization, phone, email, consultation, surgery, image } = data
    const formdata = new FormData()
    formdata.append("name", name)
    formdata.append("specialization", specialization)
    formdata.append("phone", phone)
    formdata.append("email", email)
    formdata.append("consultation", consultation.toString())
    formdata.append("surgery", surgery.toString())
    if (image && data.image instanceof File) {
      formdata.append("image", data.image);
    }
    mutateAsync(formdata, {
      onSuccess: (res) => {
        if (res?.data?.status === true) {
          toast.success(res?.data?.message)
          closeModal()
          setIsEditing(false)
          reset()
        } else {
          toast.error(res?.response?.data?.message)
        }
      }
    })
  }
  const onUpdate: SubmitHandler<DoctorFormInputs> = (data) => {
    const { name, specialization, phone, email, consultation, surgery, status } = data
    const formData = new FormData()
    formData.append("name", name)
    formData.append("specialization", specialization)
    formData.append("phone", phone)
    formData.append("email", email)
    if (status) {
      formData.append("status", status);
    }
    formData.append("consultation", consultation.toString())
    formData.append("surgery", surgery.toString())

    if (image && data.image instanceof File) {
      formData.append("image", data.image);
    }
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
    deleteDoctor(id, {
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
    if (isEditing) {
      openModal()
    }
  }, [isEditing, openModal])

  // useEffect to reset form values when editing
  React.useEffect(() => {
    if (isEditing && doctorDetails) {
      reset({
        name: doctorDetails.name,
        specialization: doctorDetails.specialization,
        phone: doctorDetails.phone,
        email: doctorDetails.email,
        consultation: doctorDetails.fees?.consultation || 0,
        surgery: doctorDetails.fees?.surgery || 0,
        status: doctorDetails.status,
        image: doctorDetails.image
      });
    } else {
      reset({
        name: "",
        specialization: "",
        phone: "",
        status: "",
      })
    }
  }, [isEditing, doctorDetails, reset]);

  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Doctor List" breadCrumbTitle="Doctors" />
          <Button size="sm" variant="primary" startIcon={<DoctorIcon />} onClick={openModal}>
            Create Doctor
          </Button>
        </div>
        <div className="space-y-6">
          <ComponentCard title="Doctors">
            <BasicTable data={doctors} tableColumns={tableColumns} onDelete={onDelete} />
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
              {!isEditing ? "Add New Doctor" : "Update Doctor"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={isEditing ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
            {
              isEditing &&
              <div className="flex justify-between items-center my-5 px-3">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Doctor Status
                </h5>
                <Badge
                  size="sm"
                  color={
                    doctorDetails?.status === "Unavailable"
                      ? "warning"
                      : doctorDetails?.status === "Available"
                        ? "success"
                        : "error"
                  }
                >
                  {doctorDetails?.status}
                </Badge>
              </div>
            }
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Image</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="image"
                        render={({ field: { onChange } }) => (
                          <FileInput onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setImage(file)
                            onChange(file)
                          }} />
                        )}
                      />
                    </div>
                    {errors.image && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.image.message}
                      </p>
                    )}
                  </div>
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
                    </div>
                    {errors.name && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Specialization</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="specialization"
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value ?? ""}
                            options={specializationType}
                            placeholder="Select Specialization"
                            className="dark:bg-dark-900"
                          />
                        )}
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                    {errors.specialization && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.specialization.message}
                      </p>
                    )}
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
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Consultation Charge</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="consultation"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="number"
                          />
                        )}
                      />
                    </div>
                    {errors.consultation && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.consultation.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Surgery Charge</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="surgery"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="number"
                          />
                        )}
                      />
                    </div>
                    {errors.surgery && (
                      <p style={{ color: "red", margin: "0", padding: "5px" }}>
                        {errors.surgery.message}
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
                        {errors.status && (
                          <p style={{ color: "red", margin: "0", padding: "5px" }}>
                            {errors.status.message}
                          </p>
                        )}
                      </div>
                    </div>
                  }
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

export default Doctor