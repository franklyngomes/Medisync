import {useMutation, useQuery} from "@tanstack/react-query"
import { queryClient } from "../../app/(admin)/provider"
import { RadiologyTestProps } from "../functions/RadiologyTestFunc"
import {ListRadiologyTest, RadiologyTestDetails, CreateRadiologyTest, RadiologyTestUpdate, RadiologyTestDelete} from "../functions/RadiologyTestFunc"


export const RadiologyTestListQuery = () => {
  return useQuery({
    queryKey: ["RadiologyTestList"],
    queryFn: ListRadiologyTest
  })
}

export const RadiologyTestCreateQuery = () => {
  return useMutation({
    mutationFn: (formData: RadiologyTestProps) => CreateRadiologyTest(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["RadiologyTestList"]})
    }
  })
}
export const RadiologyTestDetailsQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['RadiologyTestDetails', id],
    queryFn: () => RadiologyTestDetails(id),
    enabled
  })
}
export const RadiologyTestUpdateQuery = () => {
  return useMutation({
    mutationFn: ({editId, formdata} : {editId: string; formdata: RadiologyTestProps}) => RadiologyTestUpdate({editId, formdata}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["RadiologyTestList"]})
      queryClient.invalidateQueries({queryKey:["RadiologyTestDetails"]})
    }
  })
}
export const RadiologyTestDeleteQuery = () => {
  return useMutation({
    mutationFn: (id : string) => RadiologyTestDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["RadiologyTestList"]})
    }
  })
}