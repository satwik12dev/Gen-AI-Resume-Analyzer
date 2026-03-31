require("dotenv").config()
const app = require("./src/app")
const connecttoDb =  require("./src/config/Database")
connecttoDb()

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})