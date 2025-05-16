import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB successfully connected`)
    }
    catch(error){
        console.log(`failed to connect with mongoDB : ${error.message}`)
    }
}

export {connectDB} ;
