import express from 'express'
import db from '../db.js'

const router = express.Router()

//get all todos for a logged in user
router.get('/',(req,res)=>{})

//crete a new node 
router.post('/',(req,res)=>{})

//update a todo 
router.put('/:id',(req,res)=>{})

//delete a todo
router.delete('/:id',(req,res)=>{})


export default router