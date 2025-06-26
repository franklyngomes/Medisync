import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { InPatientCreate, InPatientDelete, InPatientDetails, InPatientUpdate, ListInPatients } from "../functions/InPatientFunc"

export const InPatientListQuery = () => {
  return useQuery({
    queryKey: ["InPatientList"],
    queryFn: ListInPatients
  })
}
export const CreateInPatientQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formdata: FormData) => InPatientCreate(formdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["InPatientList"] })
      queryClient.invalidateQueries({queryKey: ["InPatientDetails"]})
    }
  })
}
export const InPatientDetailsQuery = (id:string, enabled: boolean) => {
  return useQuery({
    queryKey: ["InPatientDetails", id],
    queryFn:() => InPatientDetails(id),
    enabled
  })
}
export const InPatientUpdateQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({editId, formData} : {editId: string, formData: FormData}) => InPatientUpdate({editId, formData}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["InPatientList"]})
      queryClient.invalidateQueries({queryKey: ["InPatientDetails"]})
    }
  })
}
export const InPatientDeleteQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => InPatientDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["InPatientList"]})
    }
  })
}