import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { CreateDoctor, DoctorDelete, DoctorDetails, DoctorUpdate, ListDoctor } from "../functions/DoctorFunc"


export const DoctorListQuery = () => {
  return useQuery({
    queryKey: ["ListDoctor"],
    queryFn: ListDoctor
  })
}
export const DoctorCreateQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formdata : FormData) => CreateDoctor(formdata),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["ListDoctor"]})
    }
  })
}
export const DoctorDetailsQuery = (id:string, enabled: boolean) => {
  return useQuery({
    queryKey: ["DoctorDetails", id],
    queryFn:() => DoctorDetails(id),
    enabled
  })
}
export const DoctorUpdateQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({editId, formData} : {editId: string, formData: FormData}) => DoctorUpdate({editId, formData}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["ListDoctor"]})
      queryClient.invalidateQueries({queryKey: ["DoctorDetails"]})
    }
  })
}
export const DoctorDeleteQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => DoctorDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["ListDoctor"]})
    }
  })
}