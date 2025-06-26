import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const RoomList = async () => {
  try {
    const response = await axiosInstance.get(endPoints.rooms.room_list)
    return response.data
  } catch (error) {
    return error
  }
}
export const RoomCreate = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(endPoints.rooms.room_create, formData)
    return response
  } catch (error) {
    return error
  }
}
export const RoomDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(endPoints.rooms.room_details + id)
    return response
  } catch (error) {
    return error
  }
}
export const RoomUpdate = async ({ editId, formData }: { editId: string, formData: FormData }) => {
  try {
    const response = await axiosInstance.post(endPoints.rooms.room_update+editId, formData)
    return response
  } catch (error) {
    return error
  }
}
export const RoomDelete = async(id: string) => {
  try {
    const response = await axiosInstance.post(endPoints.rooms.room_delete+id)
    return response
  } catch (error) {
    return error
  }
}