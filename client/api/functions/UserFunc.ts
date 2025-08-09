import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";
import { Cookies } from "react-cookie";

export const UserProfileFunc = () => {
  try {
    const cookies = new Cookies()
    const token = cookies.get('token')
    const response = axiosInstance.get(endPoints.userProfile, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}