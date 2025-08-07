import { useMutation, useQuery } from "@tanstack/react-query"
import { Signup, Signin, VerifyEmail, RestPassword, ForgotPassword } from "../functions/AuthFunc"

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

export const SignupQuery = () => {
  return useMutation({
    mutationFn: (payload : SignupPayload) => Signup(payload),
    onSuccess: () => {

    }
  })
}
export const SigninQuery = () => {
  return useMutation({
    mutationFn: (payload) => Signin(payload),
    onSuccess: () => {

    }
  })
}
export const VerifyEmailQuery = () => {
   return useMutation({
    mutationFn: (token : string | null) => VerifyEmail(token),
    onSuccess: () => {
    }
  })
}
export const ForgotPasswordQuery = () => {
  return useMutation({
    mutationFn: (payload) => ForgotPassword(payload),
    onSuccess: () => {

    }
  })
}
export const RestPasswordQuery = () => {
  return useMutation({
    mutationFn: (payload) => RestPassword(payload),
    onSuccess: () => {

    }
  })
}