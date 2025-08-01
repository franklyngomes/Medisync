import {useMutation, useQuery} from "@tanstack/react-query"
import { queryClient } from "../../../app/(admin)/provider"
import {ListOutpatientBill, CreateOutpatientBill, OutpatientBillDetails, OutpatientBillUpdate, OutpatientBillDelete} from "../../functions/billing/OutPatientFunc"

type UpdateProps = {
  chargeType?: string,
  noOfHour?: number,
  tax?:number,
  standardCharge?: number,
  discount?:number,
  status?: string,
}

export const OutpatientBillListQuery = () => {
  return useQuery({
    queryKey: ["OutpatientBillList"],
    queryFn: ListOutpatientBill
  })
}

export const OutpatientBillCreateQuery = () => {
  return useMutation({
    mutationFn: (formData: FormData) => CreateOutpatientBill(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["OutpatientBillList"]})
    }
  })
}
export const OutpatientBillDetailsQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['OutpatientBillDetails', id],
    queryFn: () => OutpatientBillDetails(id),
    enabled
  })
}
export const OutpatientBillUpdateQuery = () => {
  return useMutation({
    mutationFn: ({editId, payload} : {editId: string; payload: UpdateProps}) => OutpatientBillUpdate({editId, payload}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["OutpatientBillList"]})
      queryClient.invalidateQueries({queryKey:["OutpatientBillDetails"]})
    }
  })
}
export const OutpatientBillDeleteQuery = () => {
  return useMutation({
    mutationFn: (id : string) => OutpatientBillDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["OutpatientBillList"]})
    }
  })
}