import { axiosInstance } from "../../axios/axiosInstance";
import { endPoints } from "../../endPoints/endPoints";
import { Cookies } from "react-cookie";

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
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.billing.appointments.appointment_bill_list, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const CreateAppointmentBill = async (formData: FormData) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.billing.appointments.appointment_bill_create, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error

  }
}
export const AppointmentBillDetails = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.billing.appointments.appointment_bill_details + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const AppointmentBillUpdate = async ({ editId, payload }: { editId: string, payload: UpdateProps }) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.billing.appointments.appointment_bill_update + editId, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
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
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.delete(endPoints.billing.appointments.appointment_bill_delete + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}