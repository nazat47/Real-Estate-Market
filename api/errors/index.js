const CustomError=require("./Custom")
const BadRequest =require('./BadRequest')
const NotFound =require('./NotFound')
const Unathorized =require('./Unauthorized')
const Unauthenticated =require('./Unauthenticated')
module.exports={BadRequest,NotFound,Unathorized,Unauthenticated,CustomError}