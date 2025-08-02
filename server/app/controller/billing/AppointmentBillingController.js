const AppointmentBillingModel = require("../../model/billing/AppointmentBillingModel");
const HttpCode = require("../../helper/HttpCode");
const AppointmentModel = require("../../model/AppointmentModel");

class AppointmentBillingController {
  async CreateAppointmentBill(req, res) {
    try {
      const {
        appointmentId,
        chargeType,
        noOfHour,
        discount,
        source,
        paymentMethod,
      } = req.body;
      if (
        !appointmentId ||
        !chargeType ||
        !noOfHour ||
        !discount ||
        !source ||
        !paymentMethod
      ) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Some important fields are missing!",
        });
      }
      const billData = new AppointmentBillingModel({
        appointmentId,
        chargeType,
        noOfHour,
        discount,
        source,
        paymentMethod,
      });
      const appointmentDetails = await AppointmentModel.findById(appointmentId).populate("doctorId");
      if (chargeType === "consultation") {
        billData.standardCharge =
          appointmentDetails?.doctorId?.fees.consultation;
      } else if (chargeType === "surgery") {
        billData.standardCharge = appointmentDetails?.doctorId?.fees.surgery;
      }
      billData.appliedCharge = billData.standardCharge * noOfHour;
      const amount = billData.appliedCharge * (1 + billData.tax / 100);
      if (discount > 0) {
        billData.amount = amount - discount;
      } else {
        billData.amount = amount;
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
  async GetAllAppointmentBills(req, res) {
    try {
      const bills = await AppointmentBillingModel.find({
        deleted: false,
      }).populate({
        path: "appointmentId",
        populate: [
          {
            path: "patientId",
            model: "patient",
          },
          {
            path: "doctorId",
            model: "doctor",
          },
        ],
      });
      if (bills.length === 0) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No bills found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment bills fetched successfully",
          data: bills,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async AppointmentBillDetails(req, res) {
    try {
      const id = req.params.id;
      const bill = await AppointmentBillingModel.findById(id).populate({
        path: "appointmentId",
        populate: [
          {
            path: "patientId",
            model: "patient",
          },
          {
            path: "doctorId",
            model: "doctor",
          },
        ],
      });
      if (!id) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Appointment bill not found",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment bill fetched successfully",
          data: bill,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
 
  async UpdateAppointmentBill(req, res) {
    try {
      const id = req.params.id;
      const { chargeType, noOfHour, discount, status, source, paymentMethod } =
        req.body || {};

      if (!chargeType) {
        return res.status(400).json({
          status: false,
          message: "Missing chargeType",
        });
      }
      const updateData = await AppointmentBillingModel.findByIdAndUpdate(
        id,
        req.body
      );
      const appointmentDetails = await AppointmentModel.findById(id).populate(
        "doctorId"
      );
      if (chargeType === "consultation") {
        updateData.standardCharge =
          appointmentDetails?.doctorId?.fees.consultation;
      } else if (chargeType === "surgery") {
        updateData.standardCharge = appointmentDetails?.doctorId?.fees.surgery;
      }
      const tax = req.body.tax || 18;
      const appliedCharge = updateData.standardCharge * noOfHour;
      const amount = appliedCharge * (1 + tax / 100);
      if (discount > 0) {
        updateData.amount = amount - discount;
      } else {
        updateData.amount = amount;
      }

      if (!updateData) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to update appointment bill!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment bill updated successfully",
          data: updateData,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DeleteAppointmentBill(req, res) {
    try {
      const id = req.params.id;
      const deleteData = await AppointmentBillingModel.findByIdAndDelete(id);
      if (!deleteData) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Appointment bill not found",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment bill deleted successfully!",
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
}
module.exports = new AppointmentBillingController();
