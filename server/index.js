import dotenv from "dotenv"
dotenv.config();

import { app } from "./app.js";
import connectDB from "./db/connectDB.js";
import InsertDefaultData from "./default.js";


const PORT = process.env.PORT || 8080;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    })
    // InsertDefaultData();
})
.catch((error) => {
    console.log("MONGODB Connection Failed!!!");
})


