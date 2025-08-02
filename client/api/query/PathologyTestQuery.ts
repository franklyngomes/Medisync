import {useMutation, useQuery} from "@tanstack/react-query"
import {ListPathologyTest ,CreatePathologyTest, PathologyTestDetails, PathologyTestUpdate, PathologyTestDelete} from "../functions/PathologyTestFunc"
import { queryClient } from "../../app/(admin)/provider"
import { PathologyTestProps } from "../functions/PathologyTestFunc"


export const PathologyTestListQuery = () => {
  return useQuery({
    queryKey: ["PathologyTestList"],
    queryFn: ListPathologyTest
  })
}

export const PathologyTestCreateQuery = () => {
  return useMutation({
    mutationFn: (formData: PathologyTestProps) => CreatePathologyTest(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["PathologyTestList"]})
    }
  })
}
export const PathologyTestDetailsQuery = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['PathologyTestDetails', id],
    queryFn: () => PathologyTestDetails(id),
    enabled
  })
}
export const PathologyTestUpdateQuery = () => {
  return useMutation({
    mutationFn: ({editId, formdata} : {editId: string; formdata: FormData}) => PathologyTestUpdate({editId, formdata}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["PathologyTestList"]})
      queryClient.invalidateQueries({queryKey:["PathologyTestDetails"]})
    }
  })
}
export const PathologyTestDeleteQuery = () => {
  return useMutation({
    mutationFn: (id : string) => PathologyTestDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["PathologyTestList"]})
    }
  })
}