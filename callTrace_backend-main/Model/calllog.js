const mongoose = require('mongoose');

const callDataSchema = new mongoose.Schema({
  startTime: {
    type: String,
  
  },
  endTime: {
    type: String,
  },
  duration: {
    type: Number, // in seconds or minutes, up to you
  },
  nextDate: {
    type: Date,
  },
  nextTime: {
    type: String,
  },
  feedback: {
    type: String,
  },
  
  connectionState : {
    type : Number,
  },
  

  intrestLevel : Number, 
  initBy: {
    type : String, 

  },
  
}, { _id: false }); 

const callSchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  mobile: {
    type: String,
    required: true,
    immutable : true,
  },
  
  closingSummary : String, 
  collegeId : String, 
  courseId : String, 
  collegesId : [String],
  coursesId : [String],
  closedBy : String, 
  isadmitted : {
    type : Boolean,
    default : false
  },
  transfer : [],
  callData: [callDataSchema],
}, {
  timestamps: true 
});

module.exports = mongoose.model('Call', callSchema);
