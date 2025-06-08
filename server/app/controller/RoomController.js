const RoomModel = require("../model/RoomModel");
const HttpCode = require("../helper/HttpCode");

class RoomController {
  async CreateRoom(req, res) {
    try {
      const { roomNo, roomName, roomType } = req.body;
      if (!roomNo || !roomName || !roomType) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "All fields are required!",
        });
      }
      const roomData = new RoomModel({
        roomNo,
        roomName,
        roomType,
      });
      const data = await roomData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "Room created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllRooms(req, res) {
    try {
      const rooms = await RoomModel.find({ deleted: false });
      if (rooms.length === 0) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No rooms found",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Rooms fetched successfully!",
          data: rooms,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async RoomDetails(req, res) {
    try {
      const id = req.params.id;
      const room = await RoomModel.findById(id);
      if (!room) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Room not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Room fetched successfully",
          data: room,
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: true,
        message: error.message,
      });
    }
  }
  async UpdateRoom(req, res) {
    try {
      const id = req.params.id;
      const updateData = await RoomModel.findByIdAndUpdate(id, req.body);
      if (!updateData) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Room not found!",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Room updated successfully",
        });
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DeleteRoom(req, res) {
    try {
      const id = req.params.id;
      const deletedData = await RoomModel.findByIdAndDelete(id);
      if (!deletedData) {
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to delete room",
        });
      } else {
        return res.status(HttpCode.success).json({
          status: true,
          message: "Room deleted successfully",
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
module.exports = new RoomController();
