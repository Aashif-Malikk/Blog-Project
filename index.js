const express = require('express')
const app = express()
const cors = require('cors')
const ConnectDB = require('./mongConnect/db')
const authRoutes = require('./routes/auth')
const uploadRoutes = require('./routes/upload')
require('dotenv').config()
const PORT = process.env.PORT

app.use(cors({
  origin: "https://blogggwebsite.netlify.app",
  credentials: true
}));

// app.use(cors())

app.use(express.json())

app.use('/', authRoutes)
app.use('/', uploadRoutes)

ConnectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server was running on http://localhost:${PORT}`);
    })
})
