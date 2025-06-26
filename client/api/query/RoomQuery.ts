import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { RoomCreate, RoomDelete, RoomDetails, RoomList, RoomUpdate } from "../functions/RoomFunc"

export const AllRoomQuery = () => {
  return useQuery({
    queryKey: ["RoomList"],
    queryFn: RoomList
  })
}
export const CreateRoomQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formdata: FormData) => RoomCreate(formdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomList"] })
    }
  })
}
export const RoomDetailsQuery = (id:string, enabled: boolean) => {
  return useQuery({
    queryKey: ["RoomDetails", id],
    queryFn:() => RoomDetails(id),
    enabled
  })
}
export const RoomUpdateQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({editId, formData} : {editId: string, formData: FormData}) => RoomUpdate({editId, formData}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["RoomList"]})
      queryClient.invalidateQueries({queryKey: ["RoomDetails"]})
    }
  })
}
export const RoomDeleteQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => RoomDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["RoomList"]})
    }
  })
}