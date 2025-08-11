import { useMutation } from "@tanstack/react-query"
import { BillGenerationFunc} from "../functions/BillGenerationFunc"

interface BillProps {
  appointmentId?: string;
  patientId?: string;
  doctorId?: string;
  referenceDoctor?: string;
  testId?: string
  billNo?: string;
  chargeType?: string;
  noOfHour?: number;
  charge?: number;
  standardCharge?: number;
  appliedCharge?: number;
  discount: number;
  tax: number;
  source: string;
  paymentMethod: string;
  date: Date;
  status?: string;
}
export const BillGenerateQuery = () => {
  return useMutation({
    mutationFn: ({billType, billData} : {billType: string, billData:BillProps}) => BillGenerationFunc(billType, billData),
    onSuccess: () => {
    }
  })
}