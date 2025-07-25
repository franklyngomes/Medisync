// const PaymentModel = require("../model/PaymentModel");
// const HttpCode = require("../helper/HttpCode");

// class PaymentController {
//   async CreatePayment(req, res) {
//     try {
//       const { patientId, doctorId, notes, amount } = req.body;
//       if (!patientId || !doctorId || !notes || !amount) {
//         return res.status(HttpCode.notFound).json({
//           status: false,
//           message: "All fields are required!",
//         });
//       }
//       const paymentData = new PaymentModel({
//         patientId,
//         doctorId,
//         notes,
//         amount,
//       });
//       const data = await paymentData.save();
//       return res.status(HttpCode.create).json({
//         status: true,
//         message: "Payment created successfully",
//         data: data,
//       });
//     } catch (error) {
//       return res.status(HttpCode.serverError).json({
//         status: false,
//         message: error.message,
//       });
//     }
//   }
//   async GetAllPayment(req, res) {
//     try {
//       const payments = await PaymentModel.find({ deleted: false })
//         .populate("patientId")
//         .populate("doctorId")
//       if (payments.length === 0) {
//         return res.status(HttpCode.notFound).json({
//           status: false,
//           message: "No payments found",
//         });
//       } else {
//         return res.status(HttpCode.success).json({
//           status: true,
//           message: "Payments fetched successfully!",
//           data: payments,
//         });
//       }
//     } catch (error) {
//       return res.status(HttpCode.serverError).json({
//         status: false,
//         message: error.message,
//       });
//     }
//   }
//   async PaymentDetails(req, res) {
//     try {
//       const id = req.params.id;
//       const payment = await PaymentModel.findById(id)
//         .populate("patientId")
//         .populate("doctorId")
//       if (!payment) {
//         return res.status(HttpCode.notFound).json({
//           status: false,
//           message: "Payment log not found!",
//         });
//       } else {
//         return res.status(HttpCode.success).json({
//           status: true,
//           message: "Payment log fetched successfully",
//           data: payment,
//         });
//       }
//     } catch (error) {
//       return res.status(HttpCode.serverError).json({
//         status: true,
//         message: error.message,
//       });
//     }
//   }
//   async UpdatePayment(req, res) {
//     try {
//       const id = req.params.id;
//       const updateData = await PaymentModel.findByIdAndUpdate(id, req.body);
//       if (!updateData) {
//         return res.status(HttpCode.notFound).json({
//           status: false,
//           message: "Payment not found!",
//         });
//       } else {
//         return res.status(HttpCode.success).json({
//           status: true,
//           message: "Payment updated successfully",
//         });
//       }
//     } catch (error) {
//       return res.status(HttpCode.serverError).json({
//         status: false,
//         message: error.message,
//       });
//     }
//   }
//   async DeletePayment(req, res) {
//     try {
//       const id = req.params.id;
//       const deletedData = await PaymentModel.findByIdAndDelete(id);
//       if (!deletedData) {
//         return res.status(HttpCode.badRequest).json({
//           status: false,
//           message: "Failed to delete payment log",
//         });
//       } else {
//         return res.status(HttpCode.success).json({
//           status: true,
//           message: "Payment log deleted successfully",
//         });
//       }
//     } catch (error) {
//       res.status(HttpCode.serverError).json({
//         status: false,
//         message: error.message,
//       });
//     }
//   }
// }
// module.exports = new PaymentController();
