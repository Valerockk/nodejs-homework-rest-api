const jwt = require('passport-jwt')
const Users = require('../model/users')
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY

const register = async (req, res, next) => {
  try {
    const { email } = req.email
    const user = await Users.findByEmail(email)
    if (user) {
      return next({
        status: 409,
        message: 'Email is use',
      })
    }
    const newUser = await Users.create(req.body)
    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      },
    })
  } catch (e) {
    if (e.name === 'ValidationError' || e.name === 'MongoError') {
      return next({
        status: 400,
        message: e.message.replace(/'/g, ''),
      })
    }
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user.validPassword(password)
    if (!user || !isValidPassword) {
      return next({
        status: 401,
        message: 'Email is password is wrong',
      })
    }
    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(id, token)
    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (e) {
    if (e.name === 'TypeError') {
      return next({
        status: 400,
        message: 'Bad request',
      })
    }
    next(e)
  }
}

const logout = async (req, res, next) => {
  const id = req.user.id
  await Users.updateToken(id, null)
  return res.status(204).json({})
}

const currentUser = async (req, res, next) => {
  const id = req.user.id
  try {
    const user = await Users.findById(id)
    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateSubUser = async (req, res, next) => {
  const id = req.user.id
  try {
    await Users.updateSubUser(id, req.body.subscription)
    const user = await Users.findById(id)
    return res.json({
      status: 'success',
      code: 200,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (e) {
    if (e.name === 'CastError') {
      return next({
        status: 404,
        message: 'Not found',
      })
    }
    next(e)
  }
}

module.exports = { register, login, logout, currentUser, updateSubUser }
