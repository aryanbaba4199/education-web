const express = require('express');
const {createCall, updateCall, getCalls, getaCall, searchByMobile, getEmpDashboard,
    closeCall, transferCall, getCallLogs

} = require('../controller/callcontroller')
const router = express.Router()

router.post('/create', createCall)
router.put('/update', updateCall)
router.get('/get/:num/:page', getCalls)
router.get('/getacall/:id', getaCall)
router.get('/search/:mobile', searchByMobile)
router.get('/getDashboard', getEmpDashboard)
router.put('/closeCall', closeCall)
router.put('/transfer', transferCall)
router.get('/dashCalllog/:rank/:page', getCallLogs)

module.exports = router;