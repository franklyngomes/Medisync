import axios from "axios";
import { axiosInstance } from "../axios/axiosInstance";
import { endPoints } from "../endPoints/endPoints";
import { Cookies } from "react-cookie";

type SignupPayload = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  doctorId?: string,
  phone: string,
  designation: string,
  role: string
}
type SigninPayload = {
  email: string,
  password: string,
}
type ForgotPasswordPayload = {
  email: string,
}
type ResetPasswordPayload = {
  email: string,
  newPassword: string,
  code: number
}
export const Signup = async (payload: SignupPayload) => {
  try {
    const cookies = new Cookies()
    const token = cookies.get("token")
    const response = await axiosInstance.post(endPoints.auth.signup, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    return error
  }
}
export const Signin = async (payload: SigninPayload) => {
  try {
    const response = await axiosInstance.post(endPoints.auth.signin, payload)
    return response
  } catch (error) {
    return error

  }
}
export const VerifyEmail = async (token: string) => {
  try {
    const response = await axios.get(`https://medisync-backend-ybge.onrender.com/api${endPoints.auth.verify_email}`,
      {
        params: { token },
      })
    return response
  } catch (error) {
    return error
  }
}
export const ForgotPassword = async (payload: ForgotPasswordPayload) => {
  try {
    const response = await axiosInstance.post(endPoints.auth.forgot_password, payload)
    return response
  } catch (error) {
    return error
  }
}
export const RestPassword = async (payload: ResetPasswordPayload) => {
  try {
    const response = await axiosInstance.post(endPoints.auth.reset_password, payload)
    return response
  } catch (error) {
    return error
  }
}