const IPDBillingModel = require('../../model/billing/IPDBillingModel')
const HttpCode = require("../../helper/HttpCode");

class IPDBillingController {
  async CreateIPDBill(req, res) {
    try {
      const { inPatientId, chargeName, chargeType, noOfHour, standardCharge,tpaCharge, tax, discount } = req.body;
      if (!inPatientId || !chargeType || !noOfHour || !chargeName|| !standardCharge || !tpaCharge || !discount) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Some important fields are missing!",
        });
      }
      const billData = new IPDBillingModel({
      inPatientId, chargeName, chargeType, noOfHour, standardCharge,tpaCharge, tax, discount
      });
      const appliedCharge = standardCharge * noOfHour
      billData.appliedCharge = appliedCharge
      const amount = standardCharge * (1 + tax / 100)
      if(discount > 0) {
        billData.amount = amount - discount
      }else{
         billData.amount = amount
      }
      const data = await billData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "IPD bill  created successfully",
        data: data,

      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllIPDBills(req, res){
    try {
      const bills = await IPDBillingModel.find({deleted: false})
      if(bills.length === 0){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No IPD bill found!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "IPD bills fetched successfully",
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
  async IPDBillDetails(req, res){
    try {
      const id = req.params.id
      const bill = await IPDBillingModel.findById(id)
      if(!id){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: 'IPD bill  not found'
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "IPD bill  fetched successfully",
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
  async UpdateIPDBill(req, res){
    try{
      const id = req.params.id
      const {tax, standardCharge, noOfHour, discount ,status} = req.body
      const appliedCharge = standardCharge * noOfHour
      req.body.appliedCharge = appliedCharge
      const amount = standardCharge * (1 + tax / 100)
      if(discount > 0) {
        req.body.amount = amount - discount
      }else{
         req.body.amount = amount
      }
      const updateData = await IPDBillingModel.findByIdAndUpdate(id, req.body)

      if(!updateData){
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to update IPD bill!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "IPD bill  updated successfully",
          data: updateData
        })
      }
    }catch(error){
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
  async DeleteIPDBill(req, res){
    try {
      const id = req.params.id
      const deleteData = await IPDBillingModel.findByIdAndDelete(id)
      if(!deleteData){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "IPD bill  not found!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "IPD bill  deleted successfully"
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
module.exports = new IPDBillingController();
