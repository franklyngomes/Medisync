import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListPayments = () => {
  try {
    const response = axiosInstance.get(endPoints.payment.payment_list)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const CreatePayment = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.payment.payment_create, formData)
    return response
  } catch (error) {
    return error
  }
}
export const PaymentDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.payment.payment_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const PaymentUpdate = async ({ editId, formData }: { editId: string, formData: FormData }) => {
  try {
    const response = await axiosInstance.post(endPoints.payment.payment_update +editId, formData)
    return response
  } catch (error) {
    return error
  }
}
export const PaymentDelete = async(id: string) => {
  try {
    const response = await axiosInstance.post(endPoints.payment.payment_delete +id)
    return response
  } catch (error) {
    return error
  }
}