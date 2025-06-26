import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { CreatePayment, ListPayments, PaymentDelete, PaymentDetails, PaymentUpdate } from "../functions/PaymentFunc"

export const PaymentListQuery = () => {
  return useQuery({
    queryKey: ["PaymentList"],
    queryFn: ListPayments
  })
}
export const CreatePaymentsQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formdata: FormData) => CreatePayment(formdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PaymentList"] })
      queryClient.invalidateQueries({queryKey: ["PaymentDetails"]})
    }
  })
}
export const PaymentDetailsQuery = (id:string, enabled: boolean) => {
  return useQuery({
    queryKey: ["PaymentDetails", id],
    queryFn:() => PaymentDetails(id),
    enabled
  })
}
export const PaymentUpdateQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({editId, formData} : {editId: string, formData: FormData}) => PaymentUpdate({editId, formData}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["PaymentList"]})
      queryClient.invalidateQueries({queryKey: ["PaymentDetails"]})
    }
  })
}
export const PaymentDeleteQuery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => PaymentDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["PaymentList"]})
    }
  })
}