const OPDBillingModel = require("../../model/billing/OPDBillingModel");
const HttpCode = require("../../helper/HttpCode");
const OutpatientModel = require("../../model/OutPatientModel");
const { model } = require("mongoose");

class OPDBillingController {
  async CreateOPDBill(req, res) {
    try {
      const {
        outPatientId,
        chargeName,
        chargeType,
        noOfHour,
        tpaCharge,
        discount,
        source,
        paymentMethod,
      } = req.body;
      if (
        !outPatientId ||
        !chargeType ||
        !noOfHour ||
        !chargeName ||
        !tpaCharge ||
        !discount ||
        !source ||
        !paymentMethod
      ) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Some important fields are missing!",
        });
      }

      const billData = new OPDBillingModel({
        outPatientId,
        chargeName,
        chargeType,
        noOfHour,
        tpaCharge,
        discount,
        source,
        paymentMethod,
      });
      const docDetails = await OutpatientModel.findById(outPatientId).populate(
        "doctorId"
      );
      if (chargeType === "consultation") {
        billData.standardCharge = docDetails?.doctorId?.fees.consultation;
      } else if (chargeType === "surgery") {
        billData.standardCharge = docDetails?.doctorId?.fees.surgery;
      }
      const appliedCharge = billData.standardCharge * noOfHour;
      billData.appliedCharge = appliedCharge;
      billData.tax = req.body.tax || 18;
      const tax = billData.tax;
      const amount = billData.appliedCharge * (1 + tax / 100);
      if (discount > 0 || tpaCharge > 0) {
        billData.amount = amount - tpaCharge - discount;
      } else {
        billData.amount = amount;
      }

      const data = await billData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "OPD bill  created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllOPDBills(req, res) {
    try {
      const bills = await OPDBillingModel.find({ deleted: false }).populate({
        path: "outPatientId",
        populate: [
          {
            path: "doctorId",
            model: "doctor",
          },
          {
            path: "patientId",
            model: "patient",
          },
        ],
      });
      if (bills.length === 0) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No OPD bill found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "OPD bills fetched successfully",
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
  async OPDBillDetails(req, res) {
    try {
      const id = req.params.id;
      const bill = await OPDBillingModel.findById(id).populate({
        path: "outPatientId",
        populate: [
          {
            path: "doctorId",
            model: "doctor",
          },
          {
            path: "patientId",
            model: "patient",
          },
        ],
      });
      if (!id) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "OPD bill  not found",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "OPD bill  fetched successfully",
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
  async UpdateOPDBill(req, res) {
    try {
      const id = req.params.id;
      const { chargeType, noOfHour,discount } = req.body;
      const outPatient = await OPDBillingModel.findById(id)
      const updateData = await OPDBillingModel.findByIdAndUpdate(id, req.body);
      const docDetails = await OutpatientModel.findById(outPatient.
outPatientId).populate(
        "doctorId"
      );
      if (chargeType === "consultation") {
        updateData.standardCharge = docDetails?.doctorId?.fees.consultation;
      } else if (chargeType === "surgery") {
        updateData.standardCharge = docDetails?.doctorId?.fees.surgery;
      }
      // console.log(updateData.standardCharge)
      updateData.appliedCharge = updateData.standardCharge * noOfHour;
      const tax = req.body.tax || 18;
      const amount = updateData.appliedCharge * (1 + tax / 100);
      if (discount > 0) {
        updateData.amount = amount - discount;
      } else {
        updateData.amount = amount;
      }
      await updateData.save()
        return res.status(HttpCode.success).json({
          status: true,
          message: "OPD bill  updated successfully",
          data: updateData,
        });
      
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DeleteOPDBill(req, res) {
    try {
      const id = req.params.id;
      const deleteData = await OPDBillingModel.findByIdAndDelete(id);
      if (!deleteData) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "OPD bill  not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "OPD bill  deleted successfully",
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
module.exports = new OPDBillingController();
