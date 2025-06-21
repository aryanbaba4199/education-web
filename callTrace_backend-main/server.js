const express  = require('express');
const cors = require('cors')
const db = require('./utils/db')
const userroutes = require('./routes/userroutes')
const callroutes = require('./routes/callroutes')
const verifyToken = require('./utils/verification')
const adminroutes = require('./routes/adminroutes')

require('dotenv').config()
const errHandler = require('./utils/errorHandler')

const app = express();

db()

app.use(cors());
app.use(express.json());


app.use('/user', userroutes)
app.use('/call', verifyToken,  callroutes)
app.use('/admin', adminroutes)

  


app.use(errHandler)



app.listen(5000, '0.0.0.0', ()=>console.log('Server Started on 5000'))

