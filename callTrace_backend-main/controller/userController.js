const User = require('../Model/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const secret = process.env.JWT_SECRET;



const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  host : 'smtp.gmail.com',
  port : 465,
  secure : true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, 
  },
});



// Signup Controller
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, mobile, designation, createdBy } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already registered' });
    }
   

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      designation,
      createdBy,
    });

    await newUser.save();

    return res.status(200).json({message : 'Account Created'})

  } catch (e) {
    console.error('Signup Error:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login Controller
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({
      email: existingUser.email,
      mobile: existingUser.mobile,
      name: existingUser.name,
      id: existingUser._id,
    }, secret, { expiresIn: '365d' });

    return res.status(200).json({ success: true, data: token, id: existingUser._id});

  } catch (e) {
    console.error('Login Error:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getnormalusers = async(req, res, next)=>{
  try{
    const users = await User.find().select('name _id email')
    return res.status(200).json(users)
  }catch(e){
    console.error('Error in getting users', e)
    next(e)
  }
}


exports.linkedUsers = async(req, res, next)=>{
    try{
     
      const users = await User.find({createdBy : req.user._id}).select('name _id mobile')
      return res.status(200).json(users)
    }catch(e){
      console.error('Error in getting freelancers', e)
    }
}







exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
    existingUser.resetOtp = otp;
    existingUser.resetOtpExpires = otpExpires;
    await existingUser.save();
    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is : ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (e) {
    console.error('Forgot Password Error:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!existingUser.resetOtp || existingUser.resetOtp !== Number(otp)) {
      
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (existingUser.resetOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

 
    existingUser.resetOtpVerified = true;
    await existingUser.save();

    return res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (e) {
    console.error('Verify OTP Error:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!existingUser.resetOtpVerified || existingUser.resetOtp !== Number(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid or unverified OTP' });
    }

    if (existingUser.resetOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP fields
    existingUser.password = hashedPassword;
    existingUser.resetOtp = undefined;
    existingUser.resetOtpExpires = undefined;
    existingUser.resetOtpVerified = undefined;
    await existingUser.save();

    return res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (e) {
    console.error('Reset Password Error:', e);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};