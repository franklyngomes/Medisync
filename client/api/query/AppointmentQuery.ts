import {useMutation, useQuery} from "@tanstack/react-query"
import {AppointmentDetails, AppointmentUpdate, CreateAppointment, ListAppointment} from "../functions/AppointmentsFunc"
import { AppointmentListProps } from "../../types/types"
import { queryClient } from "../../app/(admin)/layout"


export const AppointmentListQuery = () => {
  return useQuery({
    queryKey: ["AppointmentList"],
    queryFn: ListAppointment
  })
}

export const AppointmentCreateQuery = () => {
  return useMutation({
    mutationFn: (formData: AppointmentListProps) => CreateAppointment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["AppointmentList"]})
    }
  })
}
export const AppointmentDetailsQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['AppointmentDetails', id],
    queryFn: () => AppointmentDetails(id),
    enabled
  })
}
export const AppointmentUpdateQuery = () => {
  return useMutation({
    mutationFn: ({editId, formdata} : {editId: string; formdata: FormData}) => AppointmentUpdate({editId, formdata}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["AppointmentList"]})
    }
  })
}