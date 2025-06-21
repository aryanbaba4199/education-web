const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name : {
        type : String, 
        require : true, 
    }, 
    email : {
        type : String, 
    },
    mobile : {
        type : String,
    },
    designation : {
        type : String, 
        default : 'employee'
    },
    password : {
        type : String, 
        require : true,
    },
    createdBy : {
        type : String, 
        default : 'self'
    },
    resetOtp : Number,
    resetOtpExpires : Number, 
    resetOtpVerified : {
        type : Boolean,
        default : false,
    }
})

module.exports = mongoose.model('User', userSchema)