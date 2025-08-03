
import { axiosInstance } from "../../axios/axiosInstance";
import { endPoints } from "../../endPoints/endPoints";

type UpdateProps = {
  discount: number,
  status: string,
  source: string,
  paymentMethod: string
}

export const ListRadiologyBill = async () => {
  try {
    const response = await axiosInstance.get(endPoints.billing.radiology.radiology_bill_list)
    return response
  } catch (error) {
    return error
  }
}
export const CreateRadiologyBill = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.billing.radiology.radiology_bill_create, formData)
    return response
  } catch (error) {
    return error

  }
}
export const RadiologyBillDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.billing.radiology.radiology_bill_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const RadiologyBillUpdate = async ({ editId, payload }: { editId: string, payload: UpdateProps }) => {
  try {
    const response = await axiosInstance.post(endPoints.billing.radiology.radiology_bill_update + editId, payload)
    return response
  } catch (error) {
    return error
  }
}
export const RadiologyBillDelete = async (id: string) => {
  try {
    const response = await axiosInstance.delete(endPoints.billing.radiology.radiology_bill_delete + id)
    return response
  } catch (error) {
    return error
  }
}