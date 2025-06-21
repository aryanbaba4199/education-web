const errHandler = (err, req, res, next)=>{
    const statusCode = err.status || 500
    const message = err.message || "Internal Server Error"
    console.log('Error Middleare : ', err)
    return res.status(statusCode).json({message})
}

module.exports =  errHandler;