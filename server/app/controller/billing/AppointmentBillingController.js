const AppointmentBillingModel = require('../../model/billing/AppointmentBillingModel')
const HttpCode = require("../../helper/HttpCode");

class AppointmentBillingController {
  async CreateAppointmentBill(req, res) {
    try {
      const { appointmentId, chargeType, noOfHour, standardCharge,tpaCharge, tax, discount } = req.body;
      if (!appointmentId || !chargeType || !noOfHour || !standardCharge || !tpaCharge || !discount) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Some important fields are missing!",
        });
      }
      const billData = new AppointmentBillingModel({
       appointmentId, chargeType, noOfHour, standardCharge,tpaCharge, tax, discount
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
        message: "Appointment bill created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllAppointmentBills(req, res){
    try {
      const bills = await AppointmentBillingModel.find({deleted: false})
      if(bills.length === 0){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No bills found!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment bills fetched successfully",
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
  async AppointmentBillDetails(req, res){
    try {
      const id = req.params.id
      const bill = await AppointmentBillingModel.findById(id)
      if(!id){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: 'Appointment bill not found'
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment bill fetched successfully",
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
  async UpdateAppointmentBill(req, res){
    try{
      const id = req.params.id
      const {tax, standardCharge, noOfHour, discount} = req.body
      const appliedCharge = standardCharge * noOfHour
      req.body.appliedCharge = appliedCharge
      const amount = standardCharge * (1 + tax / 100)
      if(discount > 0) {
        req.body.amount = amount - discount
      }else{
         req.body.amount = amount
      }
      const updateData = await AppointmentBillingModel.findByIdAndUpdate(id, req.body)

      if(!updateData){
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to update appointment bill!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment bill updated successfully",
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
  async DeleteAppointmentBill(req, res){
    try {
      const id = req.params.id
      const deleteData = await AppointmentBillingModel.findByIdAndDelete(id)
      if(!deleteData){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Appointment bill not found"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment bill deleted successfully!"
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
module.exports = new AppointmentBillingController();
