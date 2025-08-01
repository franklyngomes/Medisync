const OutPatientModel = require('../model/OutPatientModel')
const HttpCode = require("../helper/HttpCode");

class OutpatientController {
  async CreateOutPatient(req, res) {
    try {
      const { patientId, roomId, doctorId, admissionDate, diagnosis } =
        req.body;
      if (!patientId || !roomId || !doctorId || !admissionDate || !diagnosis) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "All fields are required!",
        });
      }
      const outpatientData = new OutPatientModel({
        patientId,
        roomId,
        doctorId,
        admissionDate,
        diagnosis,
      });
      const data = await outpatientData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "OutPatient created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllOutPatient(req, res) {
    try {
      const outpatients = await OutPatientModel.find({ deleted: false })
        .populate("patientId")
        .populate("roomId")
        .populate("doctorId");
      if (outpatients.length === 0) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No Outpatients found",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Outpatients fetched successfully!",
          data: outpatients,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async OutPatientDetails(req, res) {
    try {
      const id = req.params.id;
      const outpatient = await OutPatientModel.findById(id)
        .populate("patientId")
        .populate("roomId")
        .populate("doctorId");
      if (!outpatient) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Outpatients not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Outpatients fetched successfully",
          data: outpatient,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: true,
        message: error.message,
      });
    }
  }
  async UpdateOutPatient(req, res) {
    try {
      const id = req.params.id;
      const updateData = await OutPatientModel.findByIdAndUpdate(id, req.body);
      if (!updateData) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Outpatient not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Outpatient updated successfully",
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DeleteOutPatient(req, res) {
    try {
      const id = req.params.id;
      const deletedData = await OutPatientModel.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to delete Outpatients",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Outpatients deleted successfully",
        });
      }
    } catch (error) {
      res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
}
module.exports = new OutpatientController();
