const mongoose = require('mongoose')
require('dotenv').config()
const ConnectionString=`mongodb+srv://ps6000146:${process.env.DBPASSWORD}@tournamentapp.iwjm1.mongodb.net/?retryWrites=true&w=majority&appName=TournamentApp`
const connectToDatabase= async()=>{
    await mongoose.connect(ConnectionString)
    console.log('database connected successfully!!')
}

module.exports = connectToDatabase