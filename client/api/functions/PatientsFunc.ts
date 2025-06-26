import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListPatients = () => {
  try {
    const response = axiosInstance.get(endPoints.patients.patient_list)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const PatientCreate = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.patients.patient_create, formData)
    return response
  } catch (error) {
    return error
  }
}
export const PatientDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.patients.patient_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const PatientUpdate = async ({ editId, formData }: { editId: string, formData: FormData }) => {
  try {
    const response = await axiosInstance.post(endPoints.patients.patient_update +editId, formData)
    return response
  } catch (error) {
    return error
  }
}
export const PatientDelete = async(id: string) => {
  try {
    const response = await axiosInstance.post(endPoints.patients.patient_delete +id)
    return response
  } catch (error) {
    return error
  }
}