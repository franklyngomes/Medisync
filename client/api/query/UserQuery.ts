import { useQuery } from "@tanstack/react-query"
import { UserProfileFunc } from "../functions/UserFunc"

export const UserProfileQuery = () => {
  return useQuery({
    queryKey: ["UserProfile"],
    queryFn: UserProfileFunc,
  })
}