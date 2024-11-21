const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { user } = require("../models");

const routerUser = express.Router();

routerUser.put('/addUser', authenticateToken, userController.addUser);
routerUser.get('/authenticateUser', authenticateToken, userController.authenticateUser);
routerUser.get('/:Email', authenticateToken, userController.getUser);
routerUser.get('/getAllUsers', authenticateToken, userController.getAllUsers);

module.exports = routerUser;
