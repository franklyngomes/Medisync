import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListOutPatients = () => {
  try {
    const response = axiosInstance.get(endPoints.outpatients.outpatient_list)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const OutPatientsCreate = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.outpatients.outpatient_create, formData)
    return response
  } catch (error) {
    return error
  }
}
export const OutPatientsDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.outpatients.outpatient_details + id)
    return response.data
  } catch (error) {
    return error
  }
}
export const OutPatientsUpdate = async ({ editId, formData }: { editId: string, formData: FormData }) => {
  try {
    const response = await axiosInstance.post(endPoints.outpatients.outpatient_update +editId, formData)
    return response
  } catch (error) {
    return error
  }
}
export const OutPatientsDelete = async(id: string) => {
  try {
    const response = await axiosInstance.delete(endPoints.outpatients.outpatient_delete +id)
    return response
  } catch (error) {
    return error
  }
}