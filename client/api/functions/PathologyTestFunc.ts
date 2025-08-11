import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";
import { Cookies } from "react-cookie";

export type PathologyTestProps = {
  testName: string,
  category: string,
  method: string,
  reportDays: number,
  charge: number,
}
export const ListPathologyTest = async () => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.pathologyTest.pathologyTest_list, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const CreatePathologyTest = async (formData: PathologyTestProps) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.pathologyTest.pathologyTest_create, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error

  }
}
export const PathologyTestDetails = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.pathologyTest.pathologyTest_details + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const PathologyTestUpdate = async ({ editId, formdata }: { editId: string, formdata: FormData }) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.pathologyTest.pathologyTest_update + editId, formdata, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const PathologyTestDelete = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.pathologyTest.pathologyTest_delete + id,{}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}