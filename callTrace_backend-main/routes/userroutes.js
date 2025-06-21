const express = require('express');
const {createUser, login, getnormalusers, linkedUsers,
    forgotPassword, resetPassword, verifyOtp,
} = require('../controller/userController')
const verifyToken = require('../utils/verification')
const router = express.Router();


router.post('/signup', createUser )
router.post('/login', login)
router.get('/normalusers', getnormalusers)
router.get('/linkedusers', verifyToken,  linkedUsers)
router.post('/forgot', forgotPassword)
router.post('/verifyOtp', verifyOtp)
router.post('/resetPassword', resetPassword)

module.exports = router;