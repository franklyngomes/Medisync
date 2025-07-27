
import { axiosInstance } from "../../axios/axiosInstance";
import { endPoints } from "../../endPoints/endPoints";

type UpdateProps = {
  chargeType: string,
  noOfHour: number,
  discount: number,
  status: string,
  source: string,
  paymentMethod: string
}

export const ListAppointmentBill = async () => {
  try {
    const response = await axiosInstance.get(endPoints.billing.appointments.appointment_bill_list)
    return response
  } catch (error) {
    return error
  }
}
export const CreateAppointmentBill = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.billing.appointments.appointment_bill_create, formData)
    return response
  } catch (error) {
    return error

  }
}
export const AppointmentBillDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.billing.appointments.appointment_bill_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const AppointmentBillUpdate = async ({ editId, payload }: { editId: string, payload: UpdateProps }) => {
  try {
    const response = await axiosInstance.post(endPoints.billing.appointments.appointment_bill_update + editId, payload, {
      headers: {
        "Content-Type": "application/JSON"
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const AppointmentBillDelete = async (id: string) => {
  try {
    const response = await axiosInstance.delete(endPoints.billing.appointments.appointment_bill_delete + id)
    return response
  } catch (error) {
    return error
  }
}