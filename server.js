import app from "./src/app.js";
import ConnectToDB from "./src/config/database.js";

ConnectToDB();

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})