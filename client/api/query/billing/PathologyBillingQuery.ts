import {useMutation, useQuery} from "@tanstack/react-query"
import { queryClient } from "../../../app/(admin)/provider"
import {PathologyBillDelete,PathologyBillUpdate,PathologyBillDetails, ListPathologyBill, CreatePathologyBill} from "../../functions/billing/PathologyBillingFunc"

type UpdateProps = {
  discount: number,
  status: string,
  source: string,
  paymentMethod: string
}

export const PathologyBillListQuery = () => {
  return useQuery({
    queryKey: ["PathologyBillList"],
    queryFn: ListPathologyBill
  })
}

export const PathologyBillCreateQuery = () => {
  return useMutation({
    mutationFn: (formData: FormData) => CreatePathologyBill(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["PathologyBillList"]})
    }
  })
}
export const PathologyBillDetailsQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['PathologyBillDetails', id],
    queryFn: () => PathologyBillDetails(id),
    enabled
  })
}
export const PathologyBillUpdateQuery = () => {
  return useMutation({
    mutationFn: ({editId, payload} : {editId: string; payload: UpdateProps}) => PathologyBillUpdate({editId, payload}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["PathologyBillList"]})
      queryClient.invalidateQueries({queryKey:["PathologyBillDetails"]})
    }
  })
}
export const PathologyBillDeleteQuery = () => {
  return useMutation({
    mutationFn: (id : string) => PathologyBillDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["PathologyBillList"]})
    }
  })
}