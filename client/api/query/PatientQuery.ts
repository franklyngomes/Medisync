import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { ListPatients, PatientCreate, PatientDelete, PatientDetails, PatientUpdate } from "../functions/PatientsFunc"

export const PatientListQuery = () => {
  return useQuery({
    queryKey: ["PatientList"],
    queryFn: ListPatients
  })
}
export const CreatePatientQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formdata: FormData) => PatientCreate(formdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PatientList"] })
    }
  })
}
export const PatientDetailsQuery = (id:string, enabled: boolean) => {
  return useQuery({
    queryKey: ["PatientDetails", id],
    queryFn:() => PatientDetails(id),
    enabled
  })
}
export const PatientUpdateQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({editId, formData} : {editId: string, formData: FormData}) => PatientUpdate({editId, formData}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["PatientList"]})
      queryClient.invalidateQueries({queryKey: ["PatientDetails"]})
    }
  })
}
export const PatientDeleteQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => PatientDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["PatientList"]})
    }
  })
}