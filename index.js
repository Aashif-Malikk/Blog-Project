const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
const ConnectDB = require('./mongConnect/db')
const authRoutes = require('./routes/auth')
require('dotenv').config()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/', authRoutes)

ConnectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server was running on http://localhost:${PORT}`);
    })
})