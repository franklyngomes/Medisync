import { axiosInstance } from "../../axios/axiosInstance";
import { endPoints } from "../../endPoints/endPoints";
import { Cookies } from "react-cookie";

type UpdateProps = {
  discount: number,
  status: string,
  source: string,
  paymentMethod: string
}

export const ListPathologyBill = async () => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.billing.pathology.pathology_bill_list, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const CreatePathologyBill = async (formData: FormData) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.billing.pathology.pathology_bill_create, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error

  }
}
export const PathologyBillDetails = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.billing.pathology.pathology_bill_details + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const PathologyBillUpdate = async ({ editId, payload }: { editId: string, payload: UpdateProps }) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.billing.pathology.pathology_bill_update + editId, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const PathologyBillDelete = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.delete(endPoints.billing.pathology.pathology_bill_delete + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}