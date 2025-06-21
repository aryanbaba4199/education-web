require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectDb = async() =>{
    try{
        await mongoose.connect(MONGODB_URI);
        console.log('Connected To Database')
    }catch(e){
        console.error('Error in connectig to DB : ', e)
    }
}

module.exports = connectDb;