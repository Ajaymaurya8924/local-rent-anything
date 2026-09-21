// Responcibity
//    1.  Server Start
//    2.  Environment
//    3.  Database

require("dotenv").config();
const app=require("./app")
const connectDB=require("../src/config/database")
require("./config/redis");
require("./workers/email.worker");

require("./services/returnReminder.service")
    .startReturnReminderScheduler();

connectDB()
const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})     