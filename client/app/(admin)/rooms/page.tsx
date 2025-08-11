"use client"
import { AllRoomQuery, CreateRoomQuery, RoomDeleteQuery, RoomDetailsQuery, RoomUpdateQuery } from "../../../api/query/RoomQuery"
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import BasicTable from "../../../components/tables/BasicTable";
import React from "react";
import Button from "../../../components/ui/button/Button";
import { RoomIcon, ChevronDownIcon } from "../../../icons";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { useForm, Controller } from "react-hook-form";
import Badge from "../../../components/ui/badge/Badge";
import { useStore } from "../../../store/store";
import Input from "../../../components/form/input/InputField";
import toast from "react-hot-toast";

interface RoomFormProps {
  roomNo: string;
  roomName: string;
  roomType: string;
  status?:string;
}
const Room = () => {
  const { data } = AllRoomQuery()
  const rooms = data?.data
  console.log(rooms)
  const { isOpen, openModal, closeModal } = useModal();
  const { handleSubmit, reset, control } = useForm();
  const { mutateAsync } = CreateRoomQuery()
  const { editId, isEditing, setIsEditing } = useStore();
  const { data: details } = RoomDetailsQuery(editId, !!editId)
  const roomDetails = details?.data?.data
  const { mutateAsync: update } = RoomUpdateQuery()
  const { mutateAsync: deleteRoom } = RoomDeleteQuery()

  const tableColumns = [
    { label: "Room No.", key: "roomNo" },
    { label: "Room Name", key: "roomName" },
    { label: "Room Type", key: "roomType" },
    {
      label: "Status",
      key: "status",
      render: (item: RoomFormProps) => (
        <Badge
          size="sm"
          color={
            item.status === "Occupied"
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
      label: "Occupied",
      value: "Occupied"
    },
    {
      label: "Maintenance",
      value: "Maintenance"
    }
  ]
  const roomType = [
    {
      label: "General",
      value: "General",
    },
    {
      label: "Private",
      value: "Private"
    },
    {
      label: "ICU",
      value: "ICU"
    }
  ]
  const onSubmit = (data: RoomFormProps) => {
    const { roomNo, roomName, roomType } = data
    const formdata = new FormData()
    formdata.append("roomNo", roomNo)
    formdata.append("roomName", roomName)
    formdata.append("roomType", roomType)
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
  const onUpdate = (data: RoomFormProps) => {
    const { roomNo, roomName, roomType, status } = data
    const formData = new FormData()
    formData.append("roomNo", roomNo)
    formData.append("roomName", roomName)
    formData.append("roomType", roomType)
    formData.append("status", status)
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
    deleteRoom(id, {
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
    if (isEditing && roomDetails) {
      reset({
        roomNo: roomDetails.roomNo,
        roomName: roomDetails.roomName,
        roomType: roomDetails.roomType,
        status: roomDetails.status,
      });
    } else {
      reset({
        roomNo: "",
        roomName: "",
        roomType: "",
        status: "",
      })
    }
  }, [isEditing, roomDetails, reset]);

  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between items-center">
          <PageBreadcrumb pageTitle="Room List" breadCrumbTitle="Rooms" />
          <Button size="sm" variant="primary" startIcon={<RoomIcon />} onClick={openModal}>
            Create Room
          </Button>
        </div>
        <div className="space-y-6">
          <ComponentCard title="Appointments">
            <BasicTable data={rooms} tableColumns={tableColumns} onDelete={onDelete} />
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
              {!isEditing ? "Create Room" : "Update Room"}
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={isEditing ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
            {
              isEditing &&
              <div className="flex justify-between items-center my-5 px-3">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Room Status
                </h5>
                <Badge
                  size="sm"
                  color={
                    roomDetails?.status === "Occupied"
                      ? "warning"
                      : roomDetails?.status === "Available"
                        ? "success"
                        : "error"
                  }
                >
                  {roomDetails?.status}
                </Badge>
              </div>
            }
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Room No</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="roomNo"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Room Name</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="roomName"
                        render={({ field }) => (
                          <Input {...field}
                            value={field.value ?? ""}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Room Type</Label>
                    <div className="relative">
                      <Controller
                        control={control}
                        name="roomType"
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value ?? ""}
                            options={roomType}
                            placeholder="Select Room Type"
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

export default Room