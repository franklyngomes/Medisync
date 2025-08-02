import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export type RadiologyTestProps = {
  testName: string,
  category: string,
  testType: string,
  reportDays: number,
  charge:number,
}
export const ListRadiologyTest = async () => {
  try {
    const response = await axiosInstance.get(endPoints.radiologyTest.radiologyTest_list)
    return response
  } catch (error) {
    return error
  }
}
export const CreateRadiologyTest = async (formData: RadiologyTestProps) => {
  try {
    const response = await axiosInstance.post(endPoints.radiologyTest.radiologyTest_create, formData)
    return response
  } catch (error) {
    return error

  }
}
export const RadiologyTestDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.radiologyTest.radiologyTest_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const RadiologyTestUpdate = async ({ editId, formdata }: { editId: string, formdata: RadiologyTestProps }) => {
  try {
    const response = await axiosInstance.post(endPoints.radiologyTest.radiologyTest_update + editId, formdata)
    return response
  } catch (error) {
    return error
  }
}
export const RadiologyTestDelete = async (id: string) => {
  try {
    const response = await axiosInstance.post(endPoints.radiologyTest.radiologyTest_delete + id)
    return response
  } catch (error) {
    return error
  }
}