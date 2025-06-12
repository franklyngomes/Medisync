import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const ListPatients = () => {
  try {
    const response = axiosInstance.get(endPoints.patients.patient_list)
    return response
  } catch (error) {
    console.log(error)
  }
}