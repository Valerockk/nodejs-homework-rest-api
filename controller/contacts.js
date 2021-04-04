const Contacts = require('../model/contacts')

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contacts = await Contacts.listContacts(userId, req.query)
    return res.json({
      status: 'success',
      code: 200,
      data: {
        ...contacts,
      },
    })
  } catch (e) {
    next(e)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.getContactById(req.params.contactId, userId)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: 404,
        message: 'Not Found',
      })
    }
  } catch (e) {
    if (e.name === 'CastError') {
      return next({
        status: 404,
        message: 'Not Found',
      })
    }
    next(e)
  }
}

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.addContact({ ...req.body, owner: userId })
    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        contact,
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

const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return next({
        status: 400,
        message: 'Bad request',
      })
    }
    const userId = req.user.id
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
      userId
    )
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: 404,
        message: 'Not Found',
      })
    }
  } catch (e) {
    if (e.name === 'CastError') {
      return next({
        status: 404,
        message: 'Not Found',
      })
    }
    next(e)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.removeContact(req.params.contactId, userId)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return next({
        status: 404,
        message: 'Not Found',
      })
    }
  } catch (e) {
    if (e.name === 'CastError') {
      return next({
        status: 404,
        message: 'Not Found',
      })
    }
    next(e)
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
}
