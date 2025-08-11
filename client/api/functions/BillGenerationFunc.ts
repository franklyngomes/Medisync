import { endPoints } from "../endPoints/endPoints";
import { reportApi } from "../axios/axiosInstance";

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
export const BillGenerationFunc = async (billType: string, billData: BillProps) => {
  try {
    const response = await reportApi.post(endPoints.generateBill, {billType, billData})
    const {reportPath} = response?.data;

    const filename = reportPath.split("/").pop();
    const printUrl = `https://medisync-backend-ybge.onrender.com/report/print/${filename}`

    window.open(printUrl, "_blank")
    return response
  } catch (error) {
    return error
  }
}