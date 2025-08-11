import { useMutation, useQuery } from "@tanstack/react-query"
import { AppointmentDelete, AppointmentDetails, AppointmentGroup, AppointmentUpdate, CreateAppointment, ListAppointment } from "../functions/AppointmentsFunc"
import { queryClient } from "../../app/(admin)/provider"
import { AxiosResponse } from "axios";

interface AppointmentResponse {
  status: boolean;
  message: string;
  data: {
    _id: string;
    appointmentNo: string;
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    note: string;
    status: string;
  };
};

export const AppointmentListQuery = () => {
  return useQuery({
    queryKey: ["AppointmentList"],
    queryFn: ListAppointment
  })
}

export const AppointmentCreateQuery = () => {
  return useMutation({
    mutationFn: (formData: FormData) => CreateAppointment(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AppointmentList"] })
      queryClient.invalidateQueries({ queryKey: ["AppointmentGroupList"] })
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
    mutationFn: ({ editId, formdata }: { editId: string; formdata: FormData }) => AppointmentUpdate({ editId, formdata }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AppointmentList"] })
      queryClient.invalidateQueries({ queryKey: ["AppointmentDetails"] })
      queryClient.invalidateQueries({ queryKey: ["AppointmentGroupList"] })
    }
  })
}
export const AppointmentDeleteQuery = () => {
  return useMutation({
    mutationFn: (id: string) => AppointmentDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AppointmentList"] })
    }
  })
}
export const AppointmentGroupQuery = (doctorId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["AppointmentGroupList", doctorId],
    queryFn: () => AppointmentGroup(doctorId),
    enabled
  })
}