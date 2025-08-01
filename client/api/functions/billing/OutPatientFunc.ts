
import { axiosInstance } from "../../axios/axiosInstance";
import { endPoints } from "../../endPoints/endPoints";

type UpdateProps = {
  chargeType?: string,
  noOfHour?: number,
  tax?:number,
  standardCharge?: number,
  discount?:number,
  status?: string,
}

export const ListOutpatientBill = async () => {
  try {
    const response = await axiosInstance.get(endPoints.billing.opd.opd_bill_list)
    return response
  } catch (error) {
    return error
  }
}
export const CreateOutpatientBill = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.billing.opd.opd_bill_create, formData)
    return response
  } catch (error) {
    return error

  }
}
export const OutpatientBillDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.billing.opd.opd_bill_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const OutpatientBillUpdate = async ({ editId, payload }: { editId: string, payload: UpdateProps }) => {
  try {
    const response = await axiosInstance.post(endPoints.billing.opd.opd_bill_update + editId, payload, {
      headers: {
        "Content-Type": "application/JSON"
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const OutpatientBillDelete = async (id: string) => {
  try {
    const response = await axiosInstance.delete(endPoints.billing.opd.opd_bill_delete + id)
    return response
  } catch (error) {
    return error
  }
}