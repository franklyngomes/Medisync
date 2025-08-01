const DoctorModel = require("../model/DoctorModel");
const HttpCode = require("../helper/HttpCode");
const fsSync = require("fs");
const fs = require("fs").promises;

class DoctorController {
  async CreateDoctor(req, res) {
    try {
      const { name, email, phone, specialization,consultation, surgery} = req.body;
      if (!name || !email || !phone || !specialization || !consultation || !surgery) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "All fields are required!",
        });
      }
      const doctorData = new DoctorModel({
        name,
        email,
        phone,
        specialization,
        fees : {
          consultation: consultation,
          surgery: surgery
        }
      });
      if (req.file) {
        doctorData.image = req.file.path;
      }
      const data = await doctorData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "Doctor created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllDoctors(req, res) {
    try {
      const doctors = await DoctorModel.find({ deleted: false });
      if (doctors.length === 0) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No doctors found",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Doctors fetched successfully!",
          data: doctors,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DoctorDetails(req, res) {
    try {
      const id = req.params.id;
      const doctor = await DoctorModel.findById(id);
      if (!doctor) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Doctor not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Doctor fetched successfully",
          data: doctor,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: true,
        message: error.message,
      });
    }
  }
  async UpdateDoctor(req, res) {
    try {
      const id = req.params.id;
      const updateData = await DoctorModel.findByIdAndUpdate(id, req.body);
      if (!updateData) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Doctor not found!",
        });
      }
      // const fees = await JSON.parse(req.body.fees)
      console.log(updateData)
      const {consultation, surgery} = req.body
      updateData.fees = {
        consultation: consultation,
        surgery: surgery
      }
      // updateData.fees.consultation = consultation
      // updateData.fees.surgery = surgery
      if (updateData.image) {
        const existingImage = updateData.image;
        if (fsSync.existsSync(existingImage)) {
          fs.unlink(existingImage);
        }
      }
      if (req.file) {
        updateData.image = req.file.path;
      }
      const data = await updateData.save();
      return res.status(HttpCode.success).json({
        status: true,
        message: "Doctor updated successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DeleteDoctor(req, res) {
    try {
      const id = req.params.id;
      const deletedData = await DoctorModel.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to delete doctor",
        });
      }
      if (deletedData.image) {
        const existingImage = deletedData.image;
        if (fsSync.existsSync(existingImage)) {
          fs.unlink(existingImage);
        }
      }
      return res.status(HttpCode.success).json({
        status: true,
        message: "Doctor deleted successfully",
      });
    } catch (error) {
      res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
}
module.exports = new DoctorController();
