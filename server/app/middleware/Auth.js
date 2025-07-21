const bcryptjs = require("bcryptjs");
const { createHmac } = require("crypto");

const hashPassword = (password) => {
  const salt = 10;
  const hashedPassword = bcryptjs.hashSync(password, salt);
  return hashedPassword;
};
const comparePassword = async (password, hashPassword) => {
  return await bcryptjs.compareSync(password, hashPassword);
};
const AuthCheck = () => {};
const hmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};

module.exports = { hashPassword, comparePassword, AuthCheck, hmacProcess };
