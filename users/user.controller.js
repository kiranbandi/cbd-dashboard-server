const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const winston = require('winston');

// routes
// public route available to the internet !!!
router.post('/authenticate', authenticate);
// routes available to all users but response changes based on access type
router.get('/residents', getAllResidentNames);
// private routes available only to admin
router.post('/register', register);
router.post('/update/:username', update);
router.get('/all', getAllNames);
router.get('/:username', getByUsername);
router.delete('/:username', deleteUser);

module.exports = router;

function authenticate(req, res, next) {
    winston.info(req.body.username + " -- " + "login attempt");
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        // no message to send , if there is no error the UI simply shows that user has been created
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllResidentNames(req, res, next) {

    //  this comes unwrapped from the JWT token
    let { username, accessType, accessList } = req.user;
    winston.info(username + " -- " + "request for all resident names by username - " + username);

    userService.getAllResidentNames()
        .then(users => {
            if (accessType == "admin") {
                return res.json(users);
            } else if (accessType == "reviewer") {
                return res.json(users);
            } else if (accessType == "supervisor") {
                return res.json(users.filter((user) => accessList.indexOf(user.username) > -1));
            }
            // for a resident he only get access to his data 
            else {
                return res.json(users.filter((user) => user.username == username));
            }
        })
        .catch(err => next(err));
}

function getAllNames(req, res, next) {
    userService.getAllNames()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.username, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getByUsername(req, res, next) {
    userService.getByUsername(req.params.username)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    userService.deleteUser(req.params.username)
        .then(() => res.json({}))
        .catch(err => next(err));
}