const AppointmentModel = require("../model/AppointmentModel");
const HttpCode = require("../helper/HttpCode");

class AppointmentController {
  async CreateAppointment(req, res) {
    try {
      const { patientId, doctorId, appointmentDate, note } = req.body;
      console.log(req.body);
      if (!patientId || !doctorId || !appointmentDate || !note) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "All fields are required!",
        });
      }
      const appointmentData = new AppointmentModel({
        patientId,
        doctorId,
        appointmentDate,
        note,
      });
      const data = await appointmentData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "Appointment created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllAppointment(req, res){
    try {
      const appointments = await AppointmentModel.find({deleted: false}).populate("patientId").populate("doctorId")
      if(!appointments){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No appointments found!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointments fetched successfully",
          data: appointments
        })
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
  async AppointmentDetails(req, res){
    try {
      const id = req.params.id
      const appointment = await AppointmentModel.findById(id).populate('patientId').populate('doctorId')
      if(!id){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: 'Appointment not found'
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Appointment fetched successfully",
          data: appointment
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
module.exports = new AppointmentController();
