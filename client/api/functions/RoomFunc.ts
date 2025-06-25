import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const RoomList = async() => {
  try {
    const response = await axiosInstance.get(endPoints.rooms.room_list)
    return response
  } catch (error) {
    return error
  }
}
export const RoomCreate = async(formData : FormData) => {
  try {
    const response  = await axiosInstance.post(endPoints.rooms.room_create, formData)
    return response
  } catch (error) {
    return error
  }
}