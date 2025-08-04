import { endPoints } from "../endPoints/endPoints";
import { reportApi } from "../axios/axiosInstance";

export const BillGenerationFunc = (billType: string, billData: any) => {
  try {
    const response = reportApi.post(endPoints.generateBill, billType, billData)
    return response
  } catch (error) {
    return error
  }
}
export const BillPreviewFunc = (billType: string, billData: any) => {
  try {
    const response = reportApi.post(endPoints.previewBill, billType, billData)
    const html = response;
    console.log(response)

    const printWindow = window.open("", "_blank");
    if (!printWindow) throw new Error("Failed to open new window for print preview");

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close(); // This will trigger window.print() if injected
     return { success: true };
  } catch (error) {
    return error
  }
}