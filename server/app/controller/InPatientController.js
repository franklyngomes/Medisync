const InPatientModel = require("../model/InPatientModel");
const HttpCode = require("../helper/HttpCode");

class InPatientController {
  async CreateInPatient(req, res) {
    try {
      const { patientId, roomId, doctorId, admissionDate, diagnosis } =
        req.body;
      if (!patientId || !roomId || !doctorId || !admissionDate || !diagnosis) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "All fields are required!",
        });
      }
      const inpatientData = new InPatientModel({
        patientId,
        roomId,
        doctorId,
        admissionDate,
        diagnosis,
      });
      const data = await inpatientData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "InPatient created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllInPatient(req, res) {
    try {
      const inPatients = await InPatientModel.find({ deleted: false })
        .populate("patientId")
        .populate("roomId")
        .populate("doctorId");
      if (inPatients.length === 0) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No Inpatients found",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Inpatients fetched successfully!",
          data: inPatients,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async InPatientDetails(req, res) {
    try {
      const id = req.params.id;
      const inPatient = await InPatientModel.findById(id)
        .populate("patientId")
        .populate("roomId")
        .populate("doctorId");
      if (!inPatient) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Inpatients not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Inpatients fetched successfully",
          data: inPatient,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: true,
        message: error.message,
      });
    }
  }
  async UpdateInPatient(req, res) {
    try {
      const id = req.params.id;
      const updateData = await InPatientModel.findByIdAndUpdate(id, req.body);
      if (!updateData) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Inpatient not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Inpatient updated successfully",
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DeleteInPatient(req, res) {
    try {
      const id = req.params.id;
      const deletedData = await InPatientModel.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to delete Inpatient",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Inpatient deleted successfully",
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
module.exports = new InPatientController();
