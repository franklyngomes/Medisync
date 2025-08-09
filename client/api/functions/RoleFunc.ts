import { axiosInstance } from "../axios/axiosInstance"


export const RoleFunc = () => {
  try {
    const response = axiosInstance.get('/roles-config')
    return response
  } catch (error) {
    return error
  }
}