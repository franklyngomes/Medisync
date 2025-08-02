const RadiologyTestModel = require('../model/RadiologyTestModel')
const HttpCode = require("../helper/HttpCode");

class RadiologyTestController {
  async CreateRadiologyTest(req, res) {
    try {
      const { testName, category, reportDays, tax, charge } = req.body;
      if (!testName || !category || !reportDays || !charge) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Some important fields are missing!",
        });
      }
      const testData = new RadiologyTestModel({
        testName, category, reportDays, tax, charge
      });
      const amount = charge * (1 + tax / 100)
      testData.amount = amount
      const data = await testData.save();
      testData.testType = await testData.slug;
      return res.status(HttpCode.create).json({
        status: true,
        message: "Radiology test created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllRadiologyTest(req, res){
    try {
      const tests = await RadiologyTestModel.find({deleted: false})
      if(tests.length === 0){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No tests found!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Radiology tests fetched successfully",
          data: tests
        })
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
  async RadiologyTestDetails(req, res){
    try {
      const id = req.params.id
      const test = await RadiologyTestModel.findById(id)
      if(!id){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: 'Radiology test not found'
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Radiology test fetched successfully",
          data: test
        })
      }
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message
      })
    }
  }
  async UpdateRadiologyTest(req, res){
    try{
      const id = req.params.id
      const {tax, charge} = req.body
      if(req.body.testName){
        req.body.slug = req.body.testName.split(/[\s\-]+/)
        .map((word) => word[0]?.toUpperCase())
        .join("");
      }

      const updateData = await RadiologyTestModel.findByIdAndUpdate(id, req.body)

      if(!updateData){
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to update pathology test!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Radiology test updated successfully",
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
  async DeleteRadiologyTest(req, res){
    try {
      const id = req.params.id
      const deleteData = await RadiologyTestModel.findByIdAndDelete(id)
      if(!deleteData){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Radiology test not found"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Radiology test deleted successfully!"
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
module.exports = new RadiologyTestController();
