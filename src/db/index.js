import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


const connectDB = async() => {
    try{
      const conectionInstance=  await mongoose.connect(process.env.mongodb_uri+DB_NAME)
      console.log("Connected to DB successfully");
      console.log("Connection Instance Host", conectionInstance.connection.host);
    }
    catch(error){
        console.log("Error in connecting to DB", error.message);
        process.exit(1); //exit current process
    }
}
export const connect = connectDB;