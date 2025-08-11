import { endPoints } from "../endPoints/endPoints";
import { reportApi } from "../axios/axiosInstance";

export const BillGenerationFunc = async (billType: string, billData: any) => {
  try {
    const response = await reportApi.post(endPoints.generateBill, billType, billData)
    const {reportPath} = response?.data;

    const filename = reportPath.split("/").pop();
    const printUrl = `https://medisync-backend-ybge.onrender.com/report/print/${filename}`

    window.open(printUrl, "_blank")
    return response
  } catch (error) {
    return error
  }
}