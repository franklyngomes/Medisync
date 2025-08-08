import { axiosInstance } from "../../axios/axiosInstance";
import { endPoints } from "../../endPoints/endPoints";
import { Cookies } from "react-cookie";

type UpdateProps = {
  discount: number,
  status: string,
  source: string,
  paymentMethod: string
}

export const ListRadiologyBill = async () => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.billing.radiology.radiology_bill_list, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const CreateRadiologyBill = async (formData: FormData) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.billing.radiology.radiology_bill_create, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error

  }
}
export const RadiologyBillDetails = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.billing.radiology.radiology_bill_details + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const RadiologyBillUpdate = async ({ editId, payload }: { editId: string, payload: UpdateProps }) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.billing.radiology.radiology_bill_update + editId, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const RadiologyBillDelete = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.delete(endPoints.billing.radiology.radiology_bill_delete + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}