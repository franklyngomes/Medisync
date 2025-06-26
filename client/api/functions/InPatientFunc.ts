import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListInPatients = () => {
  try {
    const response = axiosInstance.get(endPoints.inpatients.inpatient_list)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const InPatientCreate = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.inpatients.inpatient_create, formData)
    return response
  } catch (error) {
    return error
  }
}
export const InPatientDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.inpatients.inpatient_details + id)
    return response.data
  } catch (error) {
    return error
  }
}
export const InPatientUpdate = async ({ editId, formData }: { editId: string, formData: FormData }) => {
  try {
    const response = await axiosInstance.post(endPoints.inpatients.inpatient_update +editId, formData)
    return response
  } catch (error) {
    return error
  }
}
export const InPatientDelete = async(id: string) => {
  try {
    const response = await axiosInstance.post(endPoints.inpatients.inpatient_delete +id)
    return response
  } catch (error) {
    return error
  }
}