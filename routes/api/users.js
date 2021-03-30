const express = require('express')
const router = express.Router()
const { validateAuth, validateUpdateSub } = require('../../service/validation')
const userController = require('../../controller/users')
const guard = require('../../service/guard')

router.post('/auth/register', validateAuth, userController.register)
router.post('/auth/login', validateAuth, userController.login)
router.post('/auth/logout', guard, userController.logout)
router.get('current', guard, userController.currentUser)
router.patch('/', validateUpdateSub, userController.updateSubUser)

module.exports = router
