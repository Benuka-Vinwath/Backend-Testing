import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).send({ message: 'Username and password are required' })
  }

  const hashedPassword = bcrypt.hashSync(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    // add the user's first todo
    const defaultTodo = 'Hello ;) add your first todo'
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id
      }
    })

    // create a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.json({ token })
  } catch (error) {
    console.log(error.message)
    // P2002 = unique constraint failed (username already taken)
    if (error.code === 'P2002') {
      return res.status(409).send({ message: 'Username already exists' })
    }
    res.sendStatus(503)
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    // if we cannot find the associated username
    if (!user) {
      return res.status(404).send({ message: 'User not found' })
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    // if the password does not match
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Invalid password' })
    }

    // successful authentication
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
    res.json({ token })
  } catch (err) {
    console.log(err.message)
    res.sendStatus(503)
  }
})

export default router