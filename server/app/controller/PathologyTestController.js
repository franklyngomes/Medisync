const PathologyTestModel = require('../model/PathologyTestModel')
const HttpCode = require("../helper/HttpCode");

class PathologyTestController {
  async CreatePathologyTest(req, res) {
    try {
      const { testName, category, method, reportDays, tax, charge } = req.body;
      if (!testName || !category || !reportDays || !charge) {
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Some important fields are missing!",
        });
      }
      const testData = new PathologyTestModel({
        testName, category, method, reportDays, tax, charge
      });
      const amount = charge * (1 + tax / 100)
      testData.amount = amount
      const data = await testData.save();
      return res.status(HttpCode.create).json({
        status: true,
        message: "Pathology test created successfully",
        data: data,
      });
    } catch (error) {
      return res.status(HttpCode.serverError).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllPathologyTest(req, res){
    try {
      const tests = await PathologyTestModel.find({deleted: false})
      if(tests.length === 0){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "No tests found!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Pathology tests fetched successfully",
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
  async PathologyTestDetails(req, res){
    try {
      const id = req.params.id
      const test = await PathologyTestModel.findById(id)
      if(!id){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: 'Pathology test not found'
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Pathology test fetched successfully",
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
  async UpdatePathologyTest(req, res){
    try{
      const id = req.params.id
      const {tax, charge} = req.body
      const amount = charge * (1 + tax / 100)
      req.body.amount = amount
      if(req.body.testName){
        req.body.slug = req.body.testName.split(/[\s\-]+/)
        .map((word) => word[0]?.toUpperCase())
        .join("");
      }
      const updateData = await PathologyTestModel.findByIdAndUpdate(id, req.body, {new:true})

      if(!updateData){
        return res.status(HttpCode.badRequest).json({
          status: false,
          message: "Failed to update pathology test!"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Pathology test updated successfully",
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
  async DeletePathologyTest(req, res){
    try {
      const id = req.params.id
      const deleteData = await PathologyTestModel.findByIdAndDelete(id)
      if(!deleteData){
        return res.status(HttpCode.notFound).json({
          status: false,
          message: "Pathology test not found"
        })
      }else{
        return res.status(HttpCode.success).json({
          status: true,
          message: "Pathology test deleted successfully!"
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
module.exports = new PathologyTestController();
