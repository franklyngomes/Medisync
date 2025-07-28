import {useMutation} from "@tanstack/react-query"
import {Signup, Signin, VerifyPassword, RestPassword, ForgotPassword} from "../functions/AuthFunc"


export const SignupQuery = () => {
  return useMutation({
    mutationFn: (payload) => Signup(payload),
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
export const VerifyPasswordQuery = () => {
  return useMutation({
    mutationFn: (payload) => VerifyPassword(payload),
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