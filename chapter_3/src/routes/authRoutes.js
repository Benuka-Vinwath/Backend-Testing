import express from 'express'
import bycrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

router.post('/register',(req,res)=>{
  const {username, password} = req.body
  
  const hashedPassword = bycrypt.hashSync(password,10)
  
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

router.post('/login',(req,res)=>{})


export default router