const PathologyBillModel = require('../../model/billing/PathologyBillingModel')
const PathologyTestModel = require('../../model/PathologyTestModel')
const HttpCode = require("../../helper/HttpCode");

class PathologyBillController {
  async CreatePathologyBill(req, res) {
    try {
      const {patientId, referenceDoctor,testId, discount, source, paymentMethod} = req.body;
      if (!patientId || !testId || !discount || !source || !paymentMethod) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Some important fields are missing!",
        });
      }
      const billData = new PathologyBillModel({
       patientId, referenceDoctor,testId, discount, source, paymentMethod
      });
      const testDetails = await PathologyTestModel.findById(testId)
      if(!testDetails){
        return res.status(HttpCode.notFound).json({
        status: false,
        message: "Test not found!",
      });
      }
      const tax = req.body.tax || 18
      const amount = testDetails.charge * (1 + tax / 100)
      if(discount > 0) {
        billData.amount = amount - discount
      }else{
         billData.amount = amount
      }
      const data = await billData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "Pathology bill created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllPathologyBills(req, res){
    try {
      const bills = await PathologyBillModel.find({deleted: false}).populate("patientId").populate("referenceDoctor").populate("testId")
      if(bills.length === 0){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No bills found!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Pathology bills fetched successfully",
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
  async PathologyBillDetails(req, res){
    try {
      const id = req.params.id
      const bill = await PathologyBillModel.findById(id).populate("patientId").populate("referenceDoctor").populate("testId")
      if(!id){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: 'Pathology bill not found'
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Pathology bill fetched successfully",
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
  async UpdatePathologyBill(req, res){
    try{
      const id = req.params.id
      const {discount, status, testId} = req.body
      const updateData = await PathologyBillModel.findByIdAndUpdate(id, req.body)
      const testDetails = await PathologyTestModel.findById(testId)
      if(!testDetails){
        return res.status(HttpCode.notFound).json({
        status: false,
        message: "Test not found!",
      });
      }
      const tax = req.body.tax || 18
      const amount = testDetails.charge * (1 + tax / 100)
      if(discount > 0) {
        updateData.amount = amount - discount
      }else{
         updateData.amount = amount
      }

      await updateData.save()
        return res.status(HttpCode.success).json({
          status: true,
          message: "Pathology bill updated successfully",
        })
    }catch(error){
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
  async DeletePathologyBill(req, res){
    try {
      const id = req.params.id
      const deleteData = await PathologyBillModel.findByIdAndDelete(id)
      if(!deleteData){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Pathology bill not found"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Pathology bill deleted successfully!"
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
module.exports = new PathologyBillController();
