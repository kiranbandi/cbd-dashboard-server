const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const winston = require('winston');
const validateTicket = require('../helpers/validateTicket');

// routes
// authenticate is the only public route available to the internet !!!
router.post('/authenticate', authenticate);
// routes available to all users but response changes based on access type
// and if no access type specified error is thrown
router.get('/residents', getAllResidentNames);
// routes available only for admins and superadmins
router.get('/reissuetoken', checkAdmin, reIssueToken);
router.post('/register', checkAdmin, register);
router.post('/update/:username', checkAdmin, update);
router.get('/all', checkAdmin, getAllUsers);
router.get('/:username', checkAdmin, getByUsername);
router.delete('/:username', checkAdmin, deleteUser);


module.exports = router;

// called to authenticate a user by checking the validity of the token issue by PAWS
function authenticate(req, res, next) {
    //  this comes unwrapped from the JWT token
    validateTicket(req.body)
        .catch((err) => res.status(400).json({ message: err }))
        .then((nsid) => userService.authenticate(nsid))
        .then((user) => res.json(user))
        .catch(err => next(err));
}

function getAllResidentNames(req, res, next) {
    //  these come unwrapped from the JWT token
    let { username, accessType, accessList, program } = req.user;
    winston.info(username + " -- " + "request for resident names by username - " + username);
    userService.getAllResidentNames(program)
        .then(users => {
            if (['admin', 'director', 'super-admin', 'reviewer'].indexOf(accessType) > -1) {
                return res.json(users);
            } else if (accessType == "supervisor") {
                return res.json(users.filter((user) => accessList.indexOf(user.username) > -1));
            }
            // for a resident he only get access to his data 
            else if (accessType == "resident") {
                return res.json(users.filter((user) => user.username == username));
            }
            // if access type is non of the above , then API is being misused
            else {
                res.status(401).json({ message: 'Unauthorized Access' });
            }
        })
        .catch(err => next(err));
}

function register(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "request to create new user");
    userService.create(req.body)
        // no message to send , if there is no error the UI simply shows that user has been created
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllUsers(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { program } = req.user;
    userService.getAllUsers(program)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.username, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getByUsername(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { program } = req.user;
    userService.getByUsername(req.params.username, program)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "deleting all records for username - " + req.params.username);
    userService.deleteUser(req.params.username)
        .then(() => res.json({}))
        .catch(err => next(err));
}

// called when super admins want to switch between programs and so get a new token
// remapped to a different program
function reIssueToken(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "request to switch programs");
    userService.reIssueToken(username, req.params.program)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function checkAdmin(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { accessType } = req.user;
    if (accessType == 'admin' || accessType == 'super-admin') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized Access' });
    }
}