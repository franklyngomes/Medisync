import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";

export const Signup = async (payload) => {
  try {
    const response = await axiosInstance.post(endPoints.auth.signup, payload)
    return response
  } catch (error) {
    return error
  }
}
export const Signin = async (payload) => {
  try {
    const response = await axiosInstance.post(endPoints.auth.signin, payload)
    return response
  } catch (error) {
    return error

  }
}
export const VerifyPassword = async (payload) => {
  try {
    const response = await axiosInstance.post(endPoints.auth.verify_email, payload)
    return response
  } catch (error) {
    return error
  }
}
export const ForgotPassword = async (payload) => {
  try {
    const response = await axiosInstance.post(endPoints.auth.forgot_password, payload)
    return response
  } catch (error) {
    return error
  }
}
export const RestPassword = async (payload) => {
  try {
    const response = await axiosInstance.post(endPoints.auth.reset_password, payload)
    return response
  } catch (error) {
    return error
  }
}