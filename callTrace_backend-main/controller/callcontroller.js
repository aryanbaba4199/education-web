const User = require("../Model/user");
const Call = require("../Model/calllog");

exports.createCall = async (req, res, next) => {
  console.log('called')
  try {
    const {
      name,
      mobile,
      
    } = req.body;
    const existingMobile = await Call.findOne({mobile : mobile});
    if(existingMobile){
      return res.status(400).json({message : 'Mobile Number is Already in follow up'})
    }
    if(mobile.length>10){
      return res.status(400).json({message : 'Mobile Number should be in 10 digit'})
    }
    

    const newCall = new Call({
      name,
      mobile,   
    });

    await newCall.save();
    return res.status(200).json(newCall._id);
  } catch (e) {
    console.error("Error in creating call:", e.message);
    next(e);
  }
};

exports.updateCall = async (req, res, next) => {
  try {
    const {
      _id,
      startTime,
      endTime,
      duration,
      nextDate,
      feedback,
      connectionState,
      intrestLevel,
      nextTime,
   
   
    } = req.body;
    const initBy = req?.user?._id?.toString();
    const {name, coursesId, collegesId,} = req.body;
  
    const updatedCall = await Call.findByIdAndUpdate(
      _id,
      {
        $push: {
          callData: {
            startTime,
            endTime,
            duration,
            nextDate,
            feedback,
            connectionState,
            intrestLevel,
            initBy,
            nextTime,
          },
        },
        name : name,
        coursesId : coursesId,
        collegesId : collegesId,
      },
      { new: true }
    );

    if (!updatedCall) {
      return res.status(404).json({ message: "Call not found" });
    }

    return res
      .status(200)
      .json({ message: "Call updated successfully", updatedCall });
  } catch (e) {
    console.error("Error in updating call:", e);
    next(e);
  }
};

exports.getCalls = async (req, res, next) => {
  const { num, page = 1 } = req.params;
  console.log('num is ', num)
  try {
    const calls = await Call.find().select('name mobile callData transfer');
    const userId = req.user._id?.toString();

    const filteredCalls = [];

    for (const call of calls) {
      if (!call.callData || call.callData.length === 0) continue;

      const lastCallData = call.callData[call.callData.length - 1];

      const isUserInvolved = lastCallData.initBy === userId || call.transfer?.includes(userId);
      const isValidNumber = lastCallData.validNumber === true;

      let shouldInclude = false;

      if (num == 1 && (lastCallData.connectionState === 1 ||
        lastCallData.connectionState ===5 ||
        lastCallData.connectionState === 3
      )
         && isUserInvolved && !isValidNumber) {
        shouldInclude = true;
      } else if (num == 0 && lastCallData.connectionState === 2 && !isValidNumber) {
        shouldInclude = true;
      } else if (num == 2 && (lastCallData.connectionState !== 1 && lastCallData.connectionState!==3 && lastCallData.connectionState!==5) && !isValidNumber) {
        shouldInclude = true;
      }

      if (shouldInclude) {
     
        filteredCalls.push({
          _id: call._id,
          name: call.name,
          mobile: call.mobile,
          callData: lastCallData 
        });
      }
    }

    // Sort by nextDate (if present), prioritize today's calls
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredCalls.sort((a, b) => {
      const aDate = a.callData?.nextDate ? new Date(a.callData.nextDate) : null;
      const bDate = b.callData?.nextDate ? new Date(b.callData.nextDate) : null;

      const isAToday = aDate && aDate.toDateString() === today.toDateString();
      const isBToday = bDate && bDate.toDateString() === today.toDateString();

      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;

      if (aDate && bDate) return aDate - bDate;
      if (aDate) return -1;
      if (bDate) return 1;
      return 0;
    });

    // Pagination (50 per page)
    const perPage = 50;
    const start = (parseInt(page) - 1) * perPage;
    const paginatedCalls = filteredCalls.slice(start, start + perPage);

    res.status(200).json(paginatedCalls);
  } catch (e) {
    console.error('Error in getCalls:', e);
    next(e);
  }
};


exports.searchByMobile = async(req, res, next)=>{
  const {mobile} = req.params;
  try{
    const call = await Call.findOne({mobile : mobile});
    if(call){
      return res.status(200).json(call)
    }else{
      return res.status(404).json({message : 'Call Not Found'})
    }
  }catch(e){
    console.error('Error in searching', e)
    next(e)
  }
}




exports.getaCall = async(req, res, next)=>{
  try{
    const call = await Call.findById(req.params.id)
    return res.status(200).json(call)
  }catch(e){
    console.error('Error in getting a call', e)
    next(e)
  }
}

exports.getEmpDashboard = async (req, res, next) => {
  const freeId = req.query?.id;
  console.log('fid', freeId)
  try {
    const userId = freeId ? freeId : req.user._id?.toString();
    const calls = await Call.find().select('callData createdAt');
    

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayCount = 0;
    let interestedCount = 0;
    let notInterestedCount = 0;
    let notConnectedCount = 0;
    let callLaterCount = 0;
    let invalidNumberCount = 0;
    let missedFollowUpCount = 0;
    let admitted = 0;

    for (const call of calls) {
      
      if (!call.callData || call.callData.length === 0) continue;

      const lastData = call.callData[call.callData.length - 1];

     
      if (lastData.initBy !== userId) continue;

      
      if (call.createdAt) {
        const createdAtDate = new Date(call.createdAt);
        if (createdAtDate.toDateString() === today.toDateString()) {
          todayCount++;
        }
      }

    
      if (lastData.nextDate) {
        const nextDate = new Date(lastData.nextDate);
        if (nextDate < today) {
          missedFollowUpCount++;
        }
      }

      console.log('connection state is ', lastData.connectionState)
      switch (lastData.connectionState) {
      
        case 1:
          interestedCount++;
          break;
        case 2:
          notInterestedCount++;
          break;
        case 3:
          notConnectedCount++;
          break;
        case 4:
          invalidNumberCount++;
          break;
        case 5:
          callLaterCount++;
          break;
        default:
          break;
      }
    }

    return res.status(200).json({
      todayCalls: todayCount,
      interestedCalls: interestedCount,
      notInterestedCalls: notInterestedCount,
      notConnectedCalls: notConnectedCount,
      callLaterCalls: callLaterCount,
      invalidNumberCalls: invalidNumberCount,
      missedFollowUps: missedFollowUpCount,
    });
  } catch (e) {
    console.error('Error in getting dashboard stats:', e);
    next(e);
  }
};





//---------------------Closing a call ----------------------
exports.closeCall = async(req, res, next)=>{
  const {id, collegeId, courseId, name, summary} = req.body;
  try{
    const call = await Call.findByIdAndUpdate(
      id, {
        name : name,
        closingSummary : summary,
        courseId : courseId, 
        collegeId : collegeId,
        isadmitted : true,
        closedBy : req.user._id?.toString()
      },
      {new : true}
    )
    if(call){
      return res.status(200).json({message : 'Registered this call as Admitted'})
    }
  }catch(e){
    console.error(e)
    next(e)
  }
}


//------------------------Transfering a call ----------------------
exports.transferCall = async (req, res, next) => {
  try {
    const { callId, userId } = req.body;


    if (req.user?.designation === 'freelancer') {
      return res.status(400).json({ message: "You cannot transfer this call" });
    }
    const call = await Call.findById(callId);
    if(call.transfer?.includes(userId)){
      return res.status(400).json({message : 'This user is already handling this call'})
    }

    const updatedCall = await Call.findByIdAndUpdate(
      callId,
      { $push: { transfer: userId } },
      { new: true }
    );

    if (!updatedCall) {
      return res.status(404).json({ message: "Call not found" });
    }

    return res.status(200).json({ message: `Call transferred to ${userId}`});
  } catch (e) {
    console.error('Error in transfer', e);
    next(e);
  }
};

//------------------------Get Call Logs for Dashboard ----------------------
exports.getCallLogs = async (req, res, next) => {
  try {
    const { rank, page } = req.params;
    const limit = 50;
    const skip = (parseInt(page) - 1) * limit;
    const selectedId = req.query?.id;
    const userId = selectedId ? selectedId :  req.user._id?.toString();

    const calls = await Call.find().select('name mobile callData createdAt _id')
    
    .sort({ createdAt: -1 }).skip(skip).limit(limit);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = [];

    for (const call of calls) {
      if (!call.callData || call.callData.length === 0) continue;

      const lastData = call.callData[call.callData.length - 1];

      if (lastData.initBy !== userId) continue;

      const item = {
        name: call.name,
        mobile: call.mobile,
        connectionState: lastData.connectionState,
        nextDate: lastData.nextDate,
        _id: call._id,
      };

      const nextDate = lastData.nextDate ? new Date(lastData.nextDate) : null;
      const isToday = nextDate && call.createdAt?.toDateString() === today.toDateString();
      const isMissedFollowUp = nextDate && nextDate < today;

      switch (parseInt(rank)) {
        case 0:
          if (isToday) result.push(item);
          break;

        case 1: // Interested calls
          if (lastData.connectionState === 1) result.push(item);
          break;

        case 2: // Not interested calls
          if (lastData.connectionState === 2) result.push(item);
          break;

        case 3: // Not connected
          if (lastData.connectionState === 3) result.push(item);
          break;

        case 4: // Invalid numbers
          if (lastData.connectionState === 4) {
            result.push({
              name: call.name,
              mobile: call.mobile,
            });
          }
          break;

        case 5: // Call later
          if (lastData.connectionState === 5) result.push(item);
          break;

        case 6: // Missed follow-up calls
          if (isMissedFollowUp) result.push(item);
          break;
        case 7 : 
            

        default:
          // no matching rank
          break;
      }
    }

    return res.status(200).json({ data: result });
  } catch (e) {
    console.error('Error in getting call logs', e);
    next(e);
  }
};


