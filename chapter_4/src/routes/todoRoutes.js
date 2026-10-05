import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

// get all todos for a logged in user
router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.userId }
    })
    res.json(todos)
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// create a new todo
router.post('/', async (req, res) => {
  const { task } = req.body

  if (!task) {
    return res.status(400).send({ message: 'Task is required' })
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        task,
        userId: req.userId
      }
    })
    res.json({ todo })
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// update a todo
router.put('/:id', async (req, res) => {
  const { completed } = req.body
  const id = parseInt(req.params.id)

  try {
    // updateMany lets us filter by id AND userId, so users can only edit their own todos
    const result = await prisma.todo.updateMany({
      where: { id, userId: req.userId },
      data: { completed: !!completed }
    })

    if (result.count === 0) {
      return res.status(404).send({ message: 'Todo not found' })
    }

    const updatedTodo = await prisma.todo.findUnique({ where: { id } })
    res.json({ updatedTodo })
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

// delete a todo
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const result = await prisma.todo.deleteMany({
      where: { id, userId: req.userId }
    })

    if (result.count === 0) {
      return res.status(404).send({ message: 'Todo not found' })
    }

    res.json({ message: 'Todo deleted' })
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

export default router