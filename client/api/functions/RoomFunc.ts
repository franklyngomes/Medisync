import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";
import { Cookies } from "react-cookie";

export const RoomList = async () => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.rooms.room_list, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    return error
  }
}
export const RoomCreate = async (formData: FormData) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.rooms.room_create, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const RoomDetails = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.get(endPoints.rooms.room_details + id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const RoomUpdate = async ({ editId, formData }: { editId: string, formData: FormData }) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.rooms.room_update + editId, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const RoomDelete = async (id: string) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.rooms.room_delete + id,{}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}