"use client"
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BasicTable from "../../../components/tables/BasicTable";
import React from "react";
import Button from "../../../components/ui/button/Button";
import { ChevronDownIcon, PathologyIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { useForm, Controller } from "react-hook-form";
import { useStore } from "../../../store/store";
import Input from "../../../components/form/input/InputField";
import toast from "react-hot-toast";
import { RadiologyTestCreateQuery, RadiologyTestListQuery, RadiologyTestDeleteQuery, RadiologyTestDetailsQuery,RadiologyTestUpdateQuery } from "../../../api/query/RadiologyTestQuery";


const Radiology = () => {
  const { data } = RadiologyTestListQuery()
  const tests = data?.data?.data
  console.log(tests)
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control } = useForm();
  const { mutateAsync } = RadiologyTestCreateQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = RadiologyTestDetailsQuery(editId, !!editId)
  const testDetails = details?.data?.data
  const { mutateAsync: update } = RadiologyTestUpdateQuery()
  const { mutateAsync: deleteAppointment } = RadiologyTestDeleteQuery()

  const categoryOptions = [
    {
      label: "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS",
      value: "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS",
    },
    {
      label: "X-RAY CHEST PA VIEW",
      value: "X-RAY CHEST PA VIEW"
    },
  ]

  const tableColumns = [
    { label: "Test Name", key: "testName" },
    { label: "Slug", key: "slug" },
    { label: "Test Type", key: "testType" },
    { label: "Category", key: "category" },
    { label: "Report Days", key: "reportDays" },
    { label: "Charge(₹)", key: "charge" },
  ]
  const onSubmit = (data: any) => {
    const { testName, category, testType, reportDays, charge } = data
    const formdata = new FormData()
    formdata.append("testName", testName)
    formdata.append("category", category)
    formdata.append("testType", testType)
    formdata.append("reportDays", reportDays)
    formdata.append("charge", charge)
    mutateAsync(formdata, {
      onSuccess: () => {
        reset()
        closeModal()
      }
    })
  }
  const onUpdate = (data: any) => {
    const { testName, category, testType, reportDays, charge } = data
    const formdata = new FormData()
    formdata.append("testName", testName)
    formdata.append("category", category)
    formdata.append("testType", testType)
    formdata.append("reportDays", reportDays)
    formdata.append("charge", charge)
    update({ editId, formdata }, {
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
    deleteAppointment(id, {
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
    if (isEditing && testDetails) {
      reset({
        testName: testDetails.testName,
        slug: testDetails.slug,
        category: testDetails.category,
        testType: testDetails.testType,
        reportDays: testDetails.reportDays,
        charge: testDetails.charge,
      });
    } else {
      reset({
        testName: "",
        slug: "",
        category: "",
        testType: "",
        reportDays: "",
        charge: "",
      })
    }
  }, [isEditing, testDetails, reset]);

  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Radiology Tests" breadCrumbTitle="" />
          <Button size="sm" variant="primary" startIcon={<PathologyIcon />} onClick={openModal}>
            Create Test
          </Button>
        </div>
        <div className="space-y-6">
          <BasicTable data={tests} tableColumns={tableColumns} onDelete={onDelete} />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => {
        setIsEditing(false)
        closeModal()
      }} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-5 dark:bg-gray-900">
          <div className="px-2 pr-14">
            <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {!isEditing ? "Create New Test" : "Update Test"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={isEditing ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Test Name</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="testName"
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
                    <Label>Select Category</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={categoryOptions}
                            placeholder="Select Category"
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
                    <Label>Test Type</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="testType"
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
                    <Label>Report Days</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="reportDays"
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
                    <Label>Charge</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="charge"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                            type="number"
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

export default Radiology