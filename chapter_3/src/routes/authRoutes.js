import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

router.post('/register',(req,res)=>{
  const {username, password} = req.body
  
  const hashedPassword = bcrypt.hashSync(password,10)
  
  try {
    const insertUser = db.prepare(`INSERT INTO users(username,password) VALUES(?,?)`)
    const result = insertUser.run(username,hashedPassword)
    
    //now we have an user, I want to add their first todo to the database 
    const defaultTodo = "Hello ;) add your first todo"
    const insertTodo = db.prepare(`INSERT INTO todos(user_id,task) VALUES(?,?)`)
    insertTodo.run(result.lastInsertRowid,defaultTodo )

    //CREATE A TOKEN 
    const token = jwt.sign({id: result.lastInsertRowid},process.env.JWT_SECRET, {expiresIn:'24h'}) 
    res.json({token })
  } catch (error) {
  console.log(error.message)
  res.sendStatus(503)
  }
})

router.post('/login',(req,res)=>{
  const {username, password} = req.body
  try{
    const getuser = db.prepare(`SELECT * FROM users WHERE username = ?`)
    const user = getuser.get(username)
    //if we cannont find the associate user name 
    if(!user){return res.status(404).send({message:'User not found'})}

    const passwordIsvalid = bcrypt.compareSync(password, user.password)
    //if the password is not match , return this function 

    if (!passwordIsvalid ){return res.status(401).send({message :"Invalid password"})}
    console.log(user)

    //then we have a successful authentication 
    const token = jwt.sign({id:user.id},process.env.JWT_SECRET, {expiresIn:'24h'})
    res.json({token})
  }catch (err){
    console.log(err.message)
    res.sendStatus(503)
  }
})


export default router