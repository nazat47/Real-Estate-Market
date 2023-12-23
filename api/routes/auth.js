const express=require('express')
const { signup, signin, googleAuth, logout } = require('../controllers/auth')
const router=express.Router()

router.post('/signup',signup)
router.post('/login',signin)
router.post('/google',googleAuth)
router.get('/logout',logout)

module.exports=router