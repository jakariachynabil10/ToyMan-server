const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4300;


app.use(cors())
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('toys server is running')
})

app.listen(port, ()=>{
    console.log(`toys port is running : ${port}`)
})