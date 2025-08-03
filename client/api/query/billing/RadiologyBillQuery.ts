import {useMutation, useQuery} from "@tanstack/react-query"
import { queryClient } from "../../../app/(admin)/provider"
import {ListRadiologyBill, CreateRadiologyBill, RadiologyBillDetails, RadiologyBillUpdate, RadiologyBillDelete} from "../../functions/billing/RadiologyBillFunc"

type UpdateProps = {
  discount: number,
  status: string,
  source: string,
  paymentMethod: string
}

export const RadiologyBillListQuery = () => {
  return useQuery({
    queryKey: ["RadiologyBillList"],
    queryFn: ListRadiologyBill
  })
}

export const RadiologyBillCreateQuery = () => {
  return useMutation({
    mutationFn: (formData: FormData) => CreateRadiologyBill(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["RadiologyBillList"]})
    }
  })
}
export const RadiologyBillDetailsQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['RadiologyBillDetails', id],
    queryFn: () => RadiologyBillDetails(id),
    enabled
  })
}
export const RadiologyBillUpdateQuery = () => {
  return useMutation({
    mutationFn: ({editId, payload} : {editId: string; payload: UpdateProps}) => RadiologyBillUpdate({editId, payload}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["RadiologyBillList"]})
      queryClient.invalidateQueries({queryKey:["RadiologyBillDetails"]})
    }
  })
}
export const RadiologyBillDeleteQuery = () => {
  return useMutation({
    mutationFn: (id : string) => RadiologyBillDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["RadiologyBillList"]})
    }
  })
}