import {useQuery} from "@tanstack/react-query"
import { ListPatients } from "../functions/PatientsFunc"

export const PatientListQuery = () => {
  return useQuery({
    queryKey: ["PatientList"],
    queryFn: ListPatients
  })
}