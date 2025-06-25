import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { RoomCreate, RoomList } from "../functions/RoomFunc"

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