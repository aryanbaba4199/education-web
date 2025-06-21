const jwt = require('jsonwebtoken');
const User = require('../Model/user')

const verifyToken  = async(req, res, next)=>{
    try{
      const token = req?.headers?.authorization?.split(" ")[1];
      if(!token){
        return res.status(401).json({message : 'Access Denied : Token Not Found'})
      }
      const decode = jwt.verify(token , process.env.JWT_SECRET);
      const user = await User.findById(decode.id);
      if(!user){
        return res.status(404).json({message : 'Unauthorized Access'})
      }
      req.user = user;
      next();
    }catch(e){
        console.error('Error in verification', e)
    }
}

module.exports = verifyToken;