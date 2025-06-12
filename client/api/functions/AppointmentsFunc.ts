import { AppointmentListProps } from "../../types/types";
import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListAppointment = () => {
  try {
    const response = axiosInstance.get(endPoints.appointments.appointment_list)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const CreateAppointment = (formData : AppointmentListProps) => {
  try {
    const response = axiosInstance.post(endPoints.appointments.appointment_create, formData)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const AppointmentDetails = (id: string) => {
  try {
    const response = axiosInstance.get(endPoints.appointments.appointment_details+id)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const AppointmentUpdate = ({editId, formdata} : {editId: string, formdata: FormData}) => {
  try {
    const response = axiosInstance.post(endPoints.appointments.appointment_update+editId, formdata)
    return response
  } catch (error) {
    console.log(error)
  }
}