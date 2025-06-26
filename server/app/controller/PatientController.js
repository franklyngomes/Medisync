const PatientModel = require("../model/PatientModel");
const HttpCode = require("../helper/HttpCode");

class PatientController {
  async CreatePatient(req, res) {
    try {
      const { name, dateOfBirth, gender, address, phone, bloodType } = req.body;
      if (!name || !dateOfBirth || !gender || !address || !phone || !bloodType) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "All fields are required!",
        });
      }
      const patientData = new PatientModel({
        name,
        gender,
        dateOfBirth,
        address,
        phone,
        bloodType,
      });
      const data = await patientData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "Patient created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllPatients(req, res) {
    try {
      const patients = await PatientModel.find({ deleted: false });
      if (patients.length === 0) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No patients found",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Patients fetched successfully!",
          data: patients,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async PatientDetails(req, res) {
    try {
      const id = req.params.id;
      const patient = await PatientModel.findById(id);
      if (!patient) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Patient not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Patient fetched successfully",
          data: patient,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: true,
        message: error.message,
      });
    }
  }
  async UpdatePatient(req, res) {
    try {
      const id = req.params.id;
      const updateData = await PatientModel.findByIdAndUpdate(id, req.body);
      if (!updateData) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Patient not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Patient updated successfully",
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DeletePatient(req, res){
    try {
      const id = req.params.id
      const deletedData = await PatientModel.findByIdAndDelete(id)
      if(!deletedData){
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to delete patient"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Patient deleted successfully"
        })
      }
    } catch (error) {
      res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
}
module.exports = new PatientController();
