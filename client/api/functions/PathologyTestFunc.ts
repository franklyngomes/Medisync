import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export type PathologyTestProps = {
  testName: string,
  category: string,
  method:string,
  reportDays: number,
  charge:number,
}
export const ListPathologyTest = async () => {
  try {
    const response = await axiosInstance.get(endPoints.pathologyTest.pathologyTest_list)
    return response
  } catch (error) {
    return error
  }
}
export const CreatePathologyTest= async (formData: PathologyTestProps) => {
  try {
    const response = await axiosInstance.post(endPoints.pathologyTest.pathologyTest_create, formData)
    return response
  } catch (error) {
    return error

  }
}
export const PathologyTestDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.pathologyTest.pathologyTest_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const PathologyTestUpdate = async ({ editId, formdata }: { editId: string, formdata: FormData }) => {
  try {
    const response = await axiosInstance.post(endPoints.pathologyTest.pathologyTest_update + editId, formdata)
    return response
  } catch (error) {
    return error
  }
}
export const PathologyTestDelete = async (id: string) => {
  try {
    const response = await axiosInstance.post(endPoints.pathologyTest.pathologyTest_delete + id)
    return response
  } catch (error) {
    return error
  }
}