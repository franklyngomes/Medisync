import { useMutation } from "@tanstack/react-query"
import { BillGenerationFunc, BillPreviewFunc } from "../functions/BillGenerationFunc"

export const BillGenerateQuery = () => {
  return useMutation({
    mutationFn: (billType : string, billData: any) => BillGenerationFunc(billType, billData),
    onSuccess: () => {
    }
  })
}