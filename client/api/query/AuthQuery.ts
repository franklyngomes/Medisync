import { useMutation} from "@tanstack/react-query"
import { Signup, Signin, VerifyEmail, RestPassword, ForgotPassword } from "../functions/AuthFunc"
import { queryClient } from "../../app/(admin)/provider"

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
type SigninPayload= {
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
export const SignupQuery = () => {
  return useMutation({
    mutationFn: (payload : SignupPayload) => Signup(payload),
    onSuccess: () => {

    }
  })
}
export const SigninQuery = () => {
  return useMutation({
    mutationFn: (payload : SigninPayload) => Signin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["UserProfile"]})
    }
  })
}
export const VerifyEmailQuery = () => {
   return useMutation({
    mutationFn: (token : string) => VerifyEmail(token),
    onSuccess: () => {
    }
  })
}
export const ForgotPasswordQuery = () => {
  return useMutation({
    mutationFn: (payload:ForgotPasswordPayload) => ForgotPassword(payload),
    onSuccess: () => {

    }
  })
}
export const RestPasswordQuery = () => {
  return useMutation({
    mutationFn: (payload : ResetPasswordPayload) => RestPassword(payload),
    onSuccess: () => {

    }
  })
}