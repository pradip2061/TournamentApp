const mongoose = require('mongoose')
require('dotenv').config()
const ConnectionString=`mongodb+srv://khelmela1:${process.env.DBPASSWORD}@cluster0.wmwat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const connectToDatabase= async()=>{
    await mongoose.connect(ConnectionString)
    console.log('database connected successfully!!')
}

module.exports = connectToDatabase