import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authmiddleware.js'
const app = express()
const PORT = process.env.PORT || 5003

//get the file path from the url of the current module
const __filename = fileURLToPath(import.meta.url)
//GET the directory name from the file path
const __dirname = dirname(__filename)

//Middleware 
app.use(express.json())
/*serves the html file the /public directory tells the express to serve all the files 
from the public folder as static assets /file 
ay requests for th css files will be resoleved to the public direcoty 
*/ 
app.use(express.static(path.join(__dirname,'../public')))//(..) meeans  we go to the up folders 


app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})

app.use('/auth',authRoutes)
app.use('/todos',authMiddleware,todoRoutes)
app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)
})