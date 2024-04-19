import dotenv from 'dotenv';
import connectDB from "./db/index.js";
dotenv.config();
import { app } from './app.js';

connectDB()
    .then(() => {
        app.listen(process.env.PORT || PORT, () => {
            console.log(`Server is running at port : ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed!!!", err);
    })