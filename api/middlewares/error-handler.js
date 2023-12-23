const {StatusCodes} =require('http-status-codes')

const customErrorHandler=(err,req,res,next)=>{
    let customError={
        msg:err.message || "Something went wrong",
        statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }
    if(err.code===11000){
        customError.msg="Email or username already exists"
        customError.statusCode=StatusCodes.BAD_REQUEST
    }
    if(err.name==='ValidationError'){
        customError.msg="Please insert all the fields"
        customError.statusCode=StatusCodes.BAD_REQUEST
    }
    if(err.name==='CastError'){
        customError.msg="Nothing found with this id"
        customError.statusCode=StatusCodes.BAD_REQUEST
    }
    return res.status(customError.statusCode).json({msg:customError.msg})
}
module.exports=customErrorHandler