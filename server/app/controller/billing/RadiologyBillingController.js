const RadiologyBillModel = require("../../model/billing/RadiologyBillingModel")
const RadiologyTestModel = require("../../model/RadiologyTestModel")
const HttpCode = require("../../helper/HttpCode");

class RadiologyBillController {
  async CreateRadiologyBill(req, res) {
    try {
      const {patientId, referenceDoctor,testId, discount} = req.body;
      if (!patientId || !testId || !discount) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Some important fields are missing!",
        });
      }
      const billData = new RadiologyBillModel({
       patientId, referenceDoctor,testId, discount
      });
      const testDetails = await RadiologyTestModel.findById(testId)
      if(!testDetails){
        return res.status(HttpCode.notFound).json({
        status: false,
        message: "Test not found!",
      });
      }
      const amount = testDetails.charge * (1 + testDetails.tax / 100)
      if(discount > 0) {
        billData.amount = amount - discount
      }else{
         billData.amount = amount
      }
      const data = await billData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "Radiology bill created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllRadiologyBills(req, res){
    try {
      const bills = await RadiologyBillModel.find({deleted: false})
      if(bills.length === 0){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No bills found!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Radiology bills fetched successfully",
          data: bills
        })
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
  async RadiologyBillDetails(req, res){
    try {
      const id = req.params.id
      const bill = await RadiologyBillModel.findById(id)
      if(!id){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: 'Radiology bill not found'
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Radiology bill fetched successfully",
          data: bill
        })
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
  async UpdateRadiologyBill(req, res){
    try{
      const id = req.params.id
      const {discount, status, testId} = req.body
      const updateData = await RadiologyBillModel.findByIdAndUpdate(id, req.body)
      const testDetails = await RadiologyTestModel.findOne({testId})
      if(!testDetails){
        return res.status(HttpCode.notFound).json({
        status: false,
        message: "Test not found!",
      });
      }
      const amount = testDetails.charge
      if(discount > 0) {
        updateData.amount = amount - discount
      }else{
         updateData.amount = amount
      }

      if(!updateData){
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to update radiology bill!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Radiology bill updated successfully",
        })
      }
    }catch(error){
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
  async DeleteRadiologyBill(req, res){
    try {
      const id = req.params.id
      const deleteData = await RadiologyBillModel.findByIdAndDelete(id)
      if(!deleteData){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Radiology bill not found"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Radiology bill deleted successfully!"
        })
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
}
module.exports = new RadiologyBillController();
