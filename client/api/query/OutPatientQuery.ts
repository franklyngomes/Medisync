import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {ListOutPatients, OutPatientsCreate, OutPatientsUpdate, OutPatientsDetails, OutPatientsDelete} from "../functions/OutPatientFunc"

export const OutPatientListQuery = () => {
  return useQuery({
    queryKey: ["OutPatientList"],
    queryFn: ListOutPatients
  })
}
export const CreateOutPatientQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formdata: FormData) => OutPatientsCreate(formdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["OutPatientList"] })
      queryClient.invalidateQueries({queryKey: ["OutPatientDetails"]})
    }
  })
}
export const OutPatientDetailsQuery = (id:string, enabled: boolean) => {
  return useQuery({
    queryKey: ["OutPatientDetails", id],
    queryFn:() => OutPatientsDetails(id),
    enabled
  })
}
export const OutPatientUpdateQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({editId, formData} : {editId: string, formData: FormData}) => OutPatientsUpdate({editId, formData}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["OutPatientList"]})
      queryClient.invalidateQueries({queryKey: ["OutPatientDetails"]})
    }
  })
}
export const OutPatientDeleteQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => OutPatientsDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["OutPatientList"]})
    }
  })
}