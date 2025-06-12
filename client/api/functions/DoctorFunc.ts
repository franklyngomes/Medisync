import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListDoctor = () => {
  try {
    const response = axiosInstance.get(endPoints.doctors.doctor_list)
    return response
  } catch (error) {
    console.log(error)
  }
}