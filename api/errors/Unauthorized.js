const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./Custom");
class Unathorized extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
module.exports = Unathorized;
