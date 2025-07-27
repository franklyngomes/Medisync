import {useMutation, useQuery} from "@tanstack/react-query"
import { queryClient } from "../../../app/(admin)/provider"
import {AppointmentBillDelete, AppointmentBillDetails, AppointmentBillUpdate, ListAppointmentBill, CreateAppointmentBill} from "../../functions/billing/AppointmentBillFunc"

type UpdateProps = {
  chargeType: string,
  noOfHour: number,
  discount: number,
  status: string,
  source: string,
  paymentMethod: string
}

export const AppointmentBillListQuery = () => {
  return useQuery({
    queryKey: ["AppointmentBillList"],
    queryFn: ListAppointmentBill
  })
}

export const AppointmentBillCreateQuery = () => {
  return useMutation({
    mutationFn: (formData: FormData) => CreateAppointmentBill(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["AppointmentBillList"]})
    }
  })
}
export const AppointmentBillDetailsQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['AppointmentBillDetails', id],
    queryFn: () => AppointmentBillDetails(id),
    enabled
  })
}
export const AppointmentBillUpdateQuery = () => {
  return useMutation({
    mutationFn: ({editId, payload} : {editId: string; payload: UpdateProps}) => AppointmentBillUpdate({editId, payload}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["AppointmentBillList"]})
      queryClient.invalidateQueries({queryKey:["AppointmentBillDetails"]})
    }
  })
}
export const AppointmentBillDeleteQuery = () => {
  return useMutation({
    mutationFn: (id : string) => AppointmentBillDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["AppointmentBillList"]})
    }
  })
}