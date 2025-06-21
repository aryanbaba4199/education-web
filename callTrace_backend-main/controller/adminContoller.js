const { default: axios } = require("axios");
const Call = require("../Model/calllog");

const User = require("../Model/user");
let colleges = [];
let courses = [];
let employess = [];

const getColleges = async () => {
  try {
    if (colleges.length > 0 && courses.length > 0 && employess.length > 0) {
      return;
    }
    const courseRes = await axios.get(
      "https://education-1064837086369.asia-south1.run.app/college/gcourse"
    );
    const collegesRes = await axios.get(
      "https://education-1064837086369.asia-south1.run.app/college/gcollege"
    );
    const empRes = await User.find();
    colleges = collegesRes.data;
    courses = courseRes.data;
    employess = empRes;
    console.log("fetched the reuired arrays");
  } catch (e) {
    console.error("Error in gettinc colleges", e);
  }
};

exports.gettodayDashboard = async (req, res, next) => {

  try {
    const now = new Date();
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

      let totalCalls = 0;
    let interested = 0;
    let notInterested = 0;
    let notConnected = 0;
    let invalid = 0;
    let expiredFollowups = 0;

    let userPerformance = {};

    const x = await Call.find({
      updatedAt: { $gte: startOfToday, $lte: endOfToday },
    });
    const todaysCalls = x.filter((call)=>{
      const lastCall = call.callData[call.callData.length-1];
      if(!lastCall) {
        totalCalls++;
        return false;
      }
      const startTime = new Date(lastCall.startTime);
      let startDuck =  (startTime>=startOfToday && startTime<=endOfToday);
      return startDuck;
    })

  

    for (const call of todaysCalls) {
      const updatedAt = new Date(call.updatedAt); 
      const updatedYear = updatedAt.getFullYear();
      const updatedMonth = updatedAt.getMonth();
      const updatedDay = updatedAt.getDate();

      if (
        updatedYear === todayYear &&
        updatedMonth === todayMonth &&
        updatedDay === todayDay
      ) {
 
        totalCalls++;
      }

      const callHistory = call.callData;
      const lastCall = callHistory.length
        ? callHistory[callHistory.length - 1]
        : null;
      if (!lastCall) continue;

      const { connectionState, initBy, nextDate } = lastCall;

      switch (connectionState) {
        case 1:
          interested++;
          userPerformance[initBy] = (userPerformance[initBy] || 0) + 1;
          break;
        case 2:
          notInterested++;

          break;
        case 3:
          notConnected++;

          break;
        case 4:
          invalid++;
          break;
      }

      // ✅ Check if last follow-up was missed
      if (
        nextDate &&
        new Date(nextDate) < now &&
        connectionState !== 2 &&
        connectionState !== 4
      ) {
        expiredFollowups++;
      }
    }

    // 🏆 Get top performer of the day
    const sortedUsers = Object.entries(userPerformance).sort(
      (a, b) => b[1] - a[1]
    );
    const todaysBestUser = sortedUsers[0]?.[0] || null;
    const eod = todaysBestUser
      ? await User.findById(todaysBestUser).select("name _id")
      : null;

    const totalUsers = await User.countDocuments();
    const totalAdmissions = await Call.countDocuments({
      isadmitted: true,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalCalls,
        intrested: interested,
        notIntrested: notInterested,
        notConnected,
        invalid,
        expiredFollowups,
        eod,
        totalUsers,
        totalAdmissions,
      },
    });
  } catch (e) {
    console.error("Error in gettodayDashboard:", e);
    next(e);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const now = new Date();

    const totalCalls = await Call.countDocuments();

    const allCalls = await Call.find(); // no date filter, fetch everything

    let intrested = 0;
    let notIntrested = 0;
    let notConnected = 0;
    let invalid = 0;
    let userPerformance = {};

    for (const call of allCalls) {
      const callHistory = call.callData;
      const lastCall = callHistory.length
        ? callHistory[callHistory.length - 1]
        : null;
      if (!lastCall) continue;

      const { connectionState, initBy } = lastCall;

      switch (connectionState) {
        case 1:
          intrested++;
          userPerformance[initBy] = (userPerformance[initBy] || 0) + 1;
          break;
        case 2:
          notIntrested++;
          // userPerformance[initBy] = (userPerformance[initBy] || 0) - 1;
          break;
        case 3:
          notConnected++;
          // userPerformance[initBy] = (userPerformance[initBy] || 0) - 1;
          break;
        case 4:
          invalid++;
          // userPerformance[initBy] = (userPerformance[initBy] || 0) - 1;
          break;
      }
    }

    const expiredFollowups = await Call.countDocuments({
      callData: {
        $elemMatch: {
          nextDate: { $lt: now },
        },
      },
    });

    const sortedUsers = Object.entries(userPerformance).sort(
      (a, b) => b[1] - a[1]
    );
    const bestUser = sortedUsers[0]?.[0] || null;
    const worstUser = sortedUsers[sortedUsers.length - 1]?.[0] || null;
    const eod = await User.findById(bestUser).select("name _id");
    const weod = await User.findById(worstUser).select("name _id");

    const totalUsers = await User.countDocuments();
    const totalAdmissions = await Call.countDocuments({ isadmitted: true });

    res.status(200).json({
      success: true,
      data: {
        totalCalls,
        intrested,
        notIntrested,
        notConnected,
        invalid,
        expiredFollowups,
        eod,
        weod,
        totalUsers,
        totalAdmissions,
      },
    });
  } catch (e) {
    console.error("Error in getDashboard:", e);
    next(e);
  }
};

exports.empdatedashboard = async (req, res, next) => {
  try {
    const { fromDate, toDate, id } = req.body;

    if (!fromDate || !id || !toDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing date or employee ID" });
    }

    // Format date with full day time range
    const startOfDay = new Date(fromDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch calls where the employee initiated at least one callData entry
    const calls = await Call.find({
      updatedAt: { $gte: startOfDay, $lte: endOfDay },
      "callData.initBy": id.toString(),
    });

    let totalCalls = 0;
    let interested = 0;
    let notInterested = 0;
    let notConnected = 0;
    let invalid = 0;
    let expiredFollowups = 0;

    for (const call of calls) {
      // Filter callData for this employee
      const userCallData = call.callData.filter(
        (cd) => cd.initBy === id.toString()
      );
      const lastCall = userCallData[userCallData.length - 1];
      if (!lastCall) continue;

      totalCalls++;

      switch (lastCall.connectionState) {
        case 1:
          interested++;
          break;
        case 2:
          notInterested++;
          break;
        case 3:
          notConnected++;
          break;
        case 4:
          invalid++;
          break;
      }

      // Check if the last follow-up by this employee was missed (nextDate before startOfDay)
      if (lastCall.nextDate && new Date(lastCall.nextDate) < startOfDay) {
        expiredFollowups++;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalCalls,
        intrested: interested,
        notIntrested: notInterested,
        notConnected,
        invalid,
        expiredFollowups,
      },
    });
  } catch (e) {
    console.error("Error in empdatedashboard:", e);
    next(e);
  }
};

exports.empStatementCalls = async (req, res, next) => {
  const { fromDate, toDate, tabId, employeeId, page = 1 } = req.body;

  try {
    await getColleges(); // Await this or data might be empty

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    const limit = 20;

    const allCalls = await Call.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ updatedAt: -1 });

    // Filter logic
    const filteredCalls = allCalls
      .map((call) => {
        const reversed = [...(call.callData || [])].reverse();
        const lastMeaningful = reversed.find(
          (item) => item.connectionState >= 1 && item.connectionState <= 4
        );
        return { call, lastCall: lastMeaningful };
      })
      .filter(({ call, lastCall }) => {
        if (!lastCall) return false;

        // Employee match
        if (lastCall.initBy?.toString() !== employeeId) return false;

        // Tab filtering
        switch (tabId) {
          case 1:
          case 2:
          case 3:
          case 4:
            return lastCall.connectionState === tabId;
          case 5:
            return call.isadmitted === true;
          case 6:
            return (
              lastCall.nextDate &&
              new Date(lastCall.nextDate) >= startDate &&
              new Date(lastCall.nextDate) <= endDate
            );
          case 0:
          default:
            return true;
        }
      });

    const totalCount = filteredCalls.length;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;

    const paginatedCalls = filteredCalls.slice(
      (page - 1) * limit,
      page * limit
    );

    const result = paginatedCalls.map(({ call, lastCall }) => {
      switch (tabId) {
        case 0:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            feedback: lastCall?.feedback,
            connectionState: lastCall?.connectionState,
            nextDate: lastCall?.nextDate,
          };
        case 1:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            isadmitted: call.isadmitted,
            collegeId:
              call.collegesId?.length > 0
                ? call.collegesId
                    .map(
                      (id) =>
                        colleges.find((item) => item._id.toString() === id)
                          ?.name
                    )
                    .filter(Boolean)
                    .join(", ")
                : colleges.find(
                    (item) => item._id.toString() === call.collegeId
                  )?.name,

            courseId:
              Array.isArray(call.coursesId) && call.coursesId.length > 0
                ? call.coursesId
                    .map(
                      (id) =>
                        courses.find((item) => item._id.toString() === id)
                          ?.title
                    )
                    .filter(Boolean)
                    .join(", ")
                : courses.find((item) => item._id.toString() === call.courseId)
                    ?.title,

            intrestLevel: lastCall?.intrestLevel,
            initBy: lastCall?.initBy,
            nextDate: lastCall?.nextDate,
          };
        case 2:
        case 3:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            feedback: lastCall?.feedback,
          };
        case 4:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
          };
        case 5:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            collegeId:
              call.collegesId?.length > 0
                ? call.collegesId
                    .map(
                      (id) =>
                        colleges.find((item) => item._id.toString() === id)
                          ?.name
                    )
                    .filter(Boolean)
                    .join(", ")
                : colleges.find(
                    (item) => item._id.toString() === call.collegeId
                  )?.name,

            courseId:
              Array.isArray(call.coursesId) && call.coursesId.length > 0
                ? call.coursesId
                    .map(
                      (id) =>
                        courses.find((item) => item._id.toString() === id)
                          ?.title
                    )
                    .filter(Boolean)
                    .join(", ")
                : courses.find((item) => item._id.toString() === call.courseId)
                    ?.title,

            closedBy: employess.find(
              (emp) => emp._id.toString() === call.closedBy
            )?.name,
            closingSummary: call.closingSummary,
          };
        case 6:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            nextDate: lastCall?.nextDate,
            initBy: lastCall?.initBy,
          };
        default:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
          };
      }
    });

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      hasNext,
      data: result,
    });
  } catch (e) {
    console.error("Error in empStatementCalls:", e);
    next(e);
  }
};

exports.getEmployeeDashboard = async (req, res, next) => {
  const id = req.params.id;

  try {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const calls = await Call.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      "callData.initBy": id,
    });

    let totalCalls = 0;
    let interested = 0;
    let notInterested = 0;
    let notConnected = 0;
    let invalid = 0;
    let expiredFollowups = 0;

    for (const call of calls) {
      const callHistory = call.callData.filter((cd) => cd.initBy === id);
      const lastCall = callHistory[callHistory.length - 1];
      if (!lastCall) continue;

      totalCalls++;

      switch (lastCall.connectionState) {
        case 1:
          interested++;
          break;
        case 2:
          notInterested++;
          break;
        case 3:
          notConnected++;
          break;
        case 4:
          invalid++;
          break;
      }

      if (lastCall.nextDate && new Date(lastCall.nextDate) < new Date()) {
        expiredFollowups++;
      }
    }

    const totalAdmissions = await Call.countDocuments({
      isadmitted: true,
      "callData.initBy": id,
    });

    res.status(200).json({
      success: true,
      data: {
        totalCalls,
        interested,
        notInterested,
        notConnected,
        invalid,
        expiredFollowups,
        totalAdmissions,
      },
    });
  } catch (e) {
    console.error("Error in getting employee dashboard:", e);
    next(e);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email mobile _id designation");
    return res.status(200).json(users);
  } catch (e) {
    console.error("Error in getting users", e);
  }
};

exports.statement = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required",
      });
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999); // End of the day

    const callsInRange = await Call.find({
      updatedAt: { $gte: startDate, $lte: endDate },
    });

    let totalCalls = callsInRange.length;
    let interested = 0;
    let notInterested = 0;
    let notConnected = 0;
    let invalid = 0;
    let userPerformance = {};

    for (const call of callsInRange) {
      const callHistory = call.callData;
      if (!callHistory || callHistory.length === 0) continue;

      // 🔁 Get last meaningful connectionState (1 or 2), ignore trailing 3s
      const reversed = [...callHistory].reverse();
      const lastMeaningful = reversed.find(
        (item) => item.connectionState === 1 || item.connectionState === 2
      );

      if (lastMeaningful) {
        if (lastMeaningful.connectionState === 1) {
          interested++;
          const initBy = lastMeaningful.initBy;
          if (initBy) {
            userPerformance[initBy] = (userPerformance[initBy] || 0) + 1;
          }
        } else if (lastMeaningful.connectionState === 2) {
          notInterested++;
        }
      } else {
        // 🛑 No 1/2 found = either all 3s or 4
        const allStates = callHistory.map((c) => c.connectionState);
        if (allStates.every((state) => state === 3)) {
          notConnected++;
        } else if (allStates.includes(4)) {
          invalid++;
        }
      }
    }

    const now = new Date();
    const expiredFollowups = await Call.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      callData: {
        $elemMatch: {
          nextDate: { $lt: now, $ne: new Date("1970-01-01T00:00:00.000Z") },
        },
      },
    });

    const sortedUsers = Object.entries(userPerformance).sort(
      (a, b) => b[1] - a[1]
    );

    const bestUserId = sortedUsers[0]?.[0] || null;
    const worstUserId = sortedUsers.at(-1)?.[0] || null;

    const eod = bestUserId
      ? await User.findById(bestUserId).select("name _id")
      : null;

    const weod = worstUserId
      ? await User.findById(worstUserId).select("name _id")
      : null;

    const totalUsers = await User.countDocuments();
    const totalAdmissions = await Call.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      isadmitted: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalCalls,
        intrested: interested,
        notIntrested: notInterested,
        notConnected,
        invalid,
        expiredFollowups,
        eod,
        weod,
        totalUsers,
        totalAdmissions,
      },
    });
  } catch (e) {
    console.error("Error in statement:", e);
    next(e);
  }
};

// controllers/callController.js
exports.statementCalls = async (req, res, next) => {
  const { fromDate, toDate, tabId, page = 1 } = req.body;

  try {
    await getColleges();

    const startDate = new Date(fromDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    const limit = 100;
    const skip = (page - 1) * limit;

    if (tabId === 6) {
      return handleTabSix({
        startDate,
        endDate,
        page,
        limit,
        res,
        next,
      });
    }

    const allCalls = await Call.find().sort({ updatedAt: -1 });

    const filteredCalls = allCalls
      .map((call) => {
        const lastCall = call.callData?.[call.callData.length - 1] || null;
        return { call, lastCall };
      })
      .filter(({ call, lastCall }) => {
        if (!lastCall || !lastCall.startTime) return false;

        const callDate = new Date(lastCall.startTime);
        if (callDate < startDate || callDate > endDate) return false;

        // 🧠 Get last meaningful state (1 or 2), ignore trailing 3s
        const reversed = [...call.callData].reverse();
        const lastMeaningful = reversed.find(
          (item) => item.connectionState === 1 || item.connectionState === 2
        );

        switch (tabId) {
          case 1:
            return (
              lastMeaningful?.connectionState === 1 && call.isadmitted !== true
            );

          case 2:
            return lastMeaningful?.connectionState === 2;

          case 3:
            return call.callData.every((data) => data.connectionState === 3);

          case 4:
            return lastCall.connectionState === 4;

          case 5:
            return call.isadmitted === true;

          case 0:
          default:
            return true;
        }
      });

    const totalCount = filteredCalls.length;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;

    const paginatedCalls = filteredCalls.slice(skip, skip + limit);

    const result = paginatedCalls.map(({ call, lastCall }) => {
      switch (tabId) {
        case 0:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            connectionState: lastCall?.connectionState,
            updatedAt: call.updatedAt,
          };
        case 1:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            intrestLevel: lastCall?.intrestLevel,
            initBy: lastCall?.initBy,
            nextDate: lastCall?.nextDate,
          };
        case 2:
        case 3:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            feedback: lastCall?.feedback,
          };
        case 4:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
          };
        case 5:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            collegeId:
              call.collegesId?.length > 0
                ? call.collegesId
                    .map(
                      (id) =>
                        colleges.find((item) => item._id.toString() === id)
                          ?.name
                    )
                    .filter(Boolean)
                    .join(", ")
                : colleges.find(
                    (item) => item._id.toString() === call.collegeId
                  )?.name,

            courseId:
              Array.isArray(call.coursesId) && call.coursesId.length > 0
                ? call.coursesId
                    .map(
                      (id) =>
                        courses.find((item) => item._id.toString() === id)
                          ?.title
                    )
                    .filter(Boolean)
                    .join(", ")
                : courses.find((item) => item._id.toString() === call.courseId)
                    ?.title,

            closedBy: employess.find(
              (item) => item._id.toString() === call.closedBy
            )?.name,
            closingSummary: call.closingSummary,
          };
        default:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
          };
      }
    });

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      hasNext,
      data: result,
    });
  } catch (err) {
    console.error("Error in statementCalls:", err);
    next(err);
  }
};

/* ───────────────────────── Tab 6 helper ───────────────────────── */
async function handleTabSix({ startDate, endDate, page, limit, res, next }) {
  try {
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: {
          updatedAt: { $gte: startDate, $lte: endDate },
          callData: { $ne: [] },
        },
      },
      {
        $addFields: { last: { $arrayElemAt: ["$callData", -1] } },
      },
      {
        $match: {
          "last.nextDate": {
            $lte: endDate, // include today
            $ne: new Date("1970-01-01T00:00:00.000Z"),
          },
        },
      },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const data = await Call.aggregate(pipeline);

    const countPipeline = pipeline
      .slice(0, 3) // drop skip/limit
      .concat({ $count: "total" });

    const countRes = await Call.aggregate(countPipeline);
    const totalCount = countRes[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;

    const rows = data.map((c) => ({
      _id: c._id,
      name: c.name,
      mobile: c.mobile,
      nextDate: c.last?.nextDate,
      initBy: c.last?.initBy,
    }));

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      hasNext,
      data: rows,
    });
  } catch (err) {
    console.error("Tab 6 pipeline failed:", err);
    next(err);
  }
}

exports.adminCalls = async (req, res, next) => {
  console.log("admin calls called");
  const page = parseInt(req.params.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;
  const tabType = req.query.tabType;

  // Define match stage dynamically
  const matchStage = [];

  if (tabType === "today") {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    matchStage.push({
      $match: {
        updatedAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      },
    });
  }

  try {
    const calls = await Call.aggregate([
      ...matchStage,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          lastCallData: { $arrayElemAt: ["$callData", -1] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "lastCallData.initBy",
          foreignField: "_id",
          as: "initByUser",
        },
      },
      {
        $unwind: {
          path: "$initByUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          mobile: 1,
          updatedAt: 1,
          isadmitted: 1,
          connectionState: "$lastCallData.connectionState",

          lastCallData: {
            connectionState: "$lastCallData.connectionState",
            initBy: "$lastCallData.initBy",
          },
        },
      },
    ]);

    const totalCalls = await Call.countDocuments(
      tabType === "today"
        ? {
            updatedAt: {
              $gte: new Date().setHours(0, 0, 0, 0),
              $lte: new Date().setHours(23, 59, 59, 999),
            },
          }
        : {}
    );

    res.status(200).json({
      success: true,
      data: calls,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCalls / limit),
        total: totalCalls,
        hasNextPage: page * limit < totalCalls,
      },
    });
  } catch (e) {
    console.error("Error in getting admin calls ", e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getcalldetails = async (req, res, next) => {
  try {
    await getColleges();
    const call = await Call.findById(req.params.id);
    const updatedCall = {
      ...call.toObject(),
      collegeId:
        call.collegesId?.length > 0
          ? call.collegesId
              .map(
                (id) =>
                  colleges.find((item) => item._id.toString() === id)?.name
              )
              .filter(Boolean)
              .join(", ")
          : colleges.find((item) => item._id.toString() === call.collegeId)
              ?.name,

      courseId:
        Array.isArray(call.coursesId) && call.coursesId.length > 0
          ? call.coursesId
              .map(
                (id) =>
                  courses.find((item) => item._id.toString() === id)?.title
              )
              .filter(Boolean)
              .join(", ")
          : courses.find((item) => item._id.toString() === call.courseId)
              ?.title,
    };

    return res.status(200).json(updatedCall);
  } catch (e) {
    console.error("Error in getting call details ", e);
    next(e);
  }
};

exports.filterCalls = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tabType = req.query?.tabType;
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;
    const parsedId = parseInt(id);

    await getColleges();

    let mongoQuery = {};
    let filterByToday = false;

    // 👇 Flag to filter today's calls later in JS (because we can't access last callData in pure MongoDB)
    if (tabType === "today") {
      filterByToday = true;
    }

    // 👇 Handle expired followups
    if (parsedId === 6) {
      let startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      let endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      mongoQuery.$expr = {
        $and: [
          { $gt: [{ $size: "$callData" }, 0] },
          {
            $lte: [{ $arrayElemAt: ["$callData.nextDate", -1] }, endOfToday],
          },
          {
            $gte: [{ $arrayElemAt: ["$callData.nextDate", -1] }, startOfToday],
          },
        ],
      };
    }

    const allCalls = await Call.find(mongoQuery).sort({ updatedAt: -1 });

    const filteredCalls = allCalls
      .map((call) => {
        const lastCall = call.callData?.[call.callData.length - 1] || null;
        return { call, lastCall };
      })
      .filter(({ call, lastCall }) => {
        if (!lastCall) return false;

        // ✅ Check if startTime is today (only if filtering today)
        if (filterByToday) {
          const callDate = new Date(lastCall.startTime);
          const now = new Date();

          if (
            callDate.getDate() !== now.getDate() ||
            callDate.getMonth() !== now.getMonth() ||
            callDate.getFullYear() !== now.getFullYear()
          ) {
            return false;
          }
        }

        // 👉 Get last meaningful call
        const reversed = [...call.callData].reverse();
        const lastMeaningful = reversed.find(
          (item) => item.connectionState === 1 || item.connectionState === 2
        );

        switch (parsedId) {
          case 1:
            return (
              lastMeaningful?.connectionState === 1 && call.isadmitted !== true
            );

          case 2:
            return lastMeaningful?.connectionState === 2;

          case 3:
            return call.callData.every((data) => data.connectionState === 3);

          case 4:
            return lastCall.connectionState === 4;

          case 5:
            return call.isadmitted === true;

          case 6:
            return true; // Already filtered by aggregation

          case 0:
          default:
            return true;
        }
      });

    const totalCount = filteredCalls.length;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;

    const paginatedCalls = filteredCalls.slice(skip, skip + limit);

    const result = paginatedCalls.map(({ call, lastCall }) => {
      switch (parsedId) {
        case 1:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            collegeId:
              call.collegesId?.length > 0
                ? call.collegesId
                    .map(
                      (id) =>
                        colleges.find((item) => item._id.toString() === id)
                          ?.name
                    )
                    .filter(Boolean)
                    .join(", ")
                : colleges.find(
                    (item) => item._id.toString() === call.collegeId
                  )?.name,

            courseId:
              Array.isArray(call.coursesId) && call.coursesId.length > 0
                ? call.coursesId
                    .map(
                      (id) =>
                        courses.find((item) => item._id.toString() === id)
                          ?.title
                    )
                    .filter(Boolean)
                    .join(", ")
                : courses.find((item) => item._id.toString() === call.courseId)
                    ?.title,

            intrestLevel: lastCall?.intrestLevel,
            feedback: lastCall.feedback,
            nextDate: lastCall.nextDate,
            initBy: employess.find(
              (item) => item._id.toString() === lastCall?.initBy
            )?.name,
            nextDate: lastCall?.nextDate,
          };
        case 2:
        case 3:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            feedback: lastCall?.feedback,
            initBy: employess.find(
              (item) => item._id.toString() === lastCall.initBy
            )?.name,
          };
        case 4:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
          };
        case 5:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
            collegeId:
              call.collegesId?.length > 0
                ? call.collegesId
                    .map(
                      (id) =>
                        colleges.find((item) => item._id.toString() === id)
                          ?.name
                    )
                    .filter(Boolean)
                    .join(", ")
                : colleges.find(
                    (item) => item._id.toString() === call.collegeId
                  )?.name,

            courseId:
              Array.isArray(call.coursesId) && call.coursesId.length > 0
                ? call.coursesId
                    .map(
                      (id) =>
                        courses.find((item) => item._id.toString() === id)
                          ?.title
                    )
                    .filter(Boolean)
                    .join(", ")
                : courses.find((item) => item._id.toString() === call.courseId)
                    ?.title,

            closedBy: employess.find(
              (item) => item._id.toString() === call.closedBy
            )?.name,
            closingSummary: call.closingSummary,
          };
        case 6:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            nextDate: lastCall?.nextDate,
            initBy: employess.find(
              (item) => item._id.toString() === lastCall?.initBy
            )?.name,
          };
        default:
          return {
            _id: call._id,
            name: call.name,
            mobile: call.mobile,
            updatedAt: call.updatedAt,
          };
      }
    });

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      hasNext,
      data: result,
    });
  } catch (e) {
    console.error("Error in filterCalls:", e);
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params?.id;
  try {
    const calls = await Call.find({ "callData.initBy": id });
    if (calls.length > 0) {
      return res.status(400).json({
        message: `${calls.length} Calls linked with this Employee, Link first....`,
      });
    } else {
      const emp = await User.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: `${emp?.name}'s ID Deleted successfully...` });
    }
  } catch (e) {
    console.error("Error in delete", e);
    next(e);
  }
};

exports.linkId = async (req, res, next) => {
  try {
    const { firstId, secondId } = req.body;
    if (!firstId || !secondId) {
      return res
        .status(400)
        .json({ message: "Both firstId and secondId are required." });
    }
    const calls = await Call.find({ "callData.initBy": firstId });

    let updatedCount = 0;

    for (const call of calls) {
      let updated = false;
      call.callData = call.callData.map((cd) => {
        if (cd.initBy === firstId) {
          updated = true;
          return { ...cd.toObject(), initBy: secondId };
        }
        return cd;
      });

      if (updated) {
        await call.save();
        updatedCount++;
      }
    }

    return res.status(200).json({
      message: `Successfully reassigned ${updatedCount} calls from ${firstId} to ${secondId}.`,
    });
  } catch (e) {
    console.error("Error in linking", e);
    next(e);
  }
};

exports.searchCall = async (req, res, next) => {
  const { mobile } = req.params;
  try {
    const call = await Call.find({
      mobile: { $regex: `^${mobile}`, $options: "i" },
    });

    if (call) {
      return res.status(200).json(call);
    } else {
      return res.status(404).json({ message: "Call not found" });
    }
  } catch (e) {
    console.error("Error in getting calls", e);
    next(e);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    await getColleges();
    const totalStudents = await Call.distinct("mobile").countDocuments();
    const stats = await Call.aggregate([
      {
        $match: {
          callData: { $ne: [] },
          $or: [
            { isadmitted: true },
            {
              callData: {
                $elemMatch: { connectionState: 1 },
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            collegeId: "$collegeId",
            courseId: "$courseId",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          collegeCounts: {
            $push: {
              collegeId: "$_id.collegeId",
              count: "$count",
            },
          },
          courseCounts: {
            $push: {
              courseId: "$_id.courseId",
              count: "$count",
            },
          },
        },
      },
    ]);

    const { collegeCounts = [], courseCounts = [] } = stats[0] || {};

    const collegeData = collegeCounts
      .map(({ collegeId, count }) => {
        const college = colleges.find((c) => c._id === collegeId);
        return college ? { name: college.name, count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.count - a.count);

    const courseData = courseCounts
      .map(({ courseId, count }) => {
        const course = courses.find((c) => c._id === courseId);
        return course ? { name: course.title, count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.count - a.count);

    const mostSelectedColleges = collegeData
      .slice(0, 5)
      .map(({ name, count }) => ({
        name,
        count,
      }));

    const mostSelectedCourses = courseData
      .slice(0, 5)
      .map(({ name, count }) => ({
        name,
        count,
      }));

    const courseWiseCounts = Object.fromEntries(
      courseData.map(({ name, count }) => [name, count])
    );

    const collegeWiseCounts = Object.fromEntries(
      collegeData.map(({ name, count }) => [name, count])
    );

    const data = {
      total_students: totalStudents,
      most_selected_colleges: mostSelectedColleges,
      most_selected_courses: mostSelectedCourses,
      course_wise_counts: courseWiseCounts,
      college_wise_counts: collegeWiseCounts,
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (e) {
    console.error("Error in getAdminUniqueAnalytics:", e);
    next(e);
  }
};
