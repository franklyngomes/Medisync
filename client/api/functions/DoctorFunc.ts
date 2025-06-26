import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListDoctor = () => {
  try {
    const response = axiosInstance.get(endPoints.doctors.doctor_list)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const CreateDoctor = (formdata: FormData) => {
  try {
    const response = axiosInstance.post(endPoints.doctors.doctor_create, formdata)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const DoctorDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.doctors.doctor_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const DoctorUpdate = async ({ editId, formData }: { editId: string, formData: FormData }) => {
  try {
    const response = await axiosInstance.post(endPoints.doctors.doctor_update + editId, formData)
    return response
  } catch (error) {
    return error
  }
}
export const DoctorDelete = async (id: string) => {
  try {
    const response = await axiosInstance.post(endPoints.doctors.doctor_delete + id)
    return response
  } catch (error) {
    return error
  }
}