import { AppointmentListProps } from "../../types/types";
import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListAppointment = async () => {
  try {
    const response = await axiosInstance.get(endPoints.appointments.appointment_list)
    return response
  } catch (error) {
    return error
  }
}
export const CreateAppointment = async (formData: AppointmentListProps) => {
  try {
    const response = await axiosInstance.post(endPoints.appointments.appointment_create, formData)
    return response
  } catch (error) {
    return error

  }
}
export const AppointmentDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.appointments.appointment_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const AppointmentUpdate = async ({ editId, formdata }: { editId: string, formdata: FormData }) => {
  try {
    const response = await axiosInstance.post(endPoints.appointments.appointment_update + editId, formdata)
    return response
  } catch (error) {
    return error
  }
}
export const AppointmentDelete = async (id: string) => {
  try {
    const response = await axiosInstance.post(endPoints.appointments.appointment_delete + id)
    return response
  } catch (error) {
    return error
  }
}