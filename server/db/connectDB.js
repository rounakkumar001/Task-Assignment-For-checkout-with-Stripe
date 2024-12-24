import mongoose from "mongoose";

const connectDB = async() => {
    try{
        const URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.n21kg.mongodb.net/?retryWrites=true&w=majority&appName=TaskTrack`;

        const connectionInstance = await mongoose.connect(URL);

        console.log('MONGODB Connected : DB Host : ', connectionInstance.connection.host)
    }
    catch (error){
        console.log("MONGODB connection FAIELD : ERROR -", error.message);
    }
}

export default connectDB