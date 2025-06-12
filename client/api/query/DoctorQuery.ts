import {useQuery} from "@tanstack/react-query"
import { ListDoctor } from "../functions/DoctorFunc"


export const DoctorListQuery = () => {
  return useQuery({
    queryKey: ["ListDoctor"],
    queryFn: ListDoctor
  })
}