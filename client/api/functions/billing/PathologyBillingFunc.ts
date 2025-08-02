
import { axiosInstance } from "../../axios/axiosInstance";
import { endPoints } from "../../endPoints/endPoints";

type UpdateProps = {
  discount: number,
  status: string,
  source: string,
  paymentMethod: string
}

export const ListPathologyBill = async () => {
  try {
    const response = await axiosInstance.get(endPoints.billing.pathology.pathology_bill_list)
    return response
  } catch (error) {
    return error
  }
}
export const CreatePathologyBill = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.billing.pathology.pathology_bill_create, formData)
    return response
  } catch (error) {
    return error

  }
}
export const PathologyBillDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.billing.pathology.pathology_bill_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const PathologyBillUpdate = async ({ editId, payload }: { editId: string, payload: UpdateProps }) => {
  try {
    const response = await axiosInstance.post(endPoints.billing.pathology.pathology_bill_update + editId, payload)
    return response
  } catch (error) {
    return error
  }
}
export const PathologyBillDelete = async (id: string) => {
  try {
    const response = await axiosInstance.delete(endPoints.billing.pathology.pathology_bill_delete + id)
    return response
  } catch (error) {
    return error
  }
}