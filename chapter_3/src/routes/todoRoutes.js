import express from 'express'
import db from '../db.js'

const router = express.Router()

//get all todos for a logged in user
router.get('/',(req,res)=>{
  const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`)
  const todos = getTodos.all(req.userId)
  res.json(todos)
})

//crete a new node 
router.post('/',(req,res)=>{
  const {task} = req.body
  const insertTodo = db.prepare(`INSERT INTO todos(user_id,task) VALUES (?,?)`)
  const result = insertTodo.run(req.userId,task)
  res.json({id: result.lastInsertRowid,task,completed: 0})
})

//update a todo 
router.put('/:id',(req,res)=>{
  const {task,completed} = req.body
  const updateTodo = db.prepare(`UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?`)
  updateTodo.run(task,completed,req.params.id,req.userId)
  res.json({id: req.params.id,task,completed})
})

//delete a todo
router.delete('/:id',(req,res)=>{
  const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
  deleteTodo.run(req.params.id,req.userId)
  res.json({message: "Todo deleted"})
})

export default router