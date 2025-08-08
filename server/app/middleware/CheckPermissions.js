const {ROLE_PERMISSIONS} = require('../config/roles')
const HttpCode = require('../helper/HttpCode')

const CheckPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req?.user?.role
    if(!userRole){
      return res.status(HttpCode.badRequest).json({
        status: false,
        message: "Role not found"
      })
    }
    const permissions = ROLE_PERMISSIONS[userRole];
    const hasPermission = requiredPermissions.every(p => permissions.includes(p))

    if(!hasPermission){
      return res.status(HttpCode.forbidden).json({
        status: false,
        message: "You're not authorized!"
      })
    }
    next();
  }
}
module.exports = CheckPermissions