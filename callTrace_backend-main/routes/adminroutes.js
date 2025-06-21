const express = require('express');
const {getDashboard, adminCalls, getcalldetails, gettodayDashboard, statement,
    getEmployeeDashboard, getUsers, filterCalls, empdatedashboard, statementCalls,
    empStatementCalls, deleteUser, linkId, searchCall, getAnalytics

} = require('../controller/adminContoller');

const router = express.Router();

router.get('/dashboard', getDashboard)
router.get('/gettoadysdata', gettodayDashboard)
router.get('/admincalls/:page', adminCalls)
router.get('/getcalldetails/:id', getcalldetails)
router.post('/statement', statement)
router.post('/statementCalls', statementCalls)
router.get('/users', getUsers)
router.get('/empDashboard/:id', getEmployeeDashboard)
router.get('/filterCalls/:id', filterCalls)
router.post('/empDateDash', empdatedashboard)
router.post('/empStatementCalls', empStatementCalls)
router.delete('/deleteeid/:id', deleteUser)
router.put('/linkid', linkId)
router.get('/searchCalls/:mobile', searchCall)
router.get('/getAnalytics', getAnalytics)


module.exports = router;