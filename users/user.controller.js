const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const winston = require('winston');
const validateTicket = require('../helpers/validateTicket');

// routes
// authenticate is the only public route available to the internet !!!
router.post('/authenticate', authenticate);
router.get('/reissuetoken', reIssueToken);
// routes available to all users but response changes based on access type
router.get('/residents', getAllResidentNames);
// private routes available only to admin
router.post('/register', register);
router.post('/update/:username', update);
router.get('/all', getAllUsers);
router.get('/:username', getByUsername);
router.delete('/:username', deleteUser);

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

function register(req, res, next) {
    userService.create(req.body)
        // no message to send , if there is no error the UI simply shows that user has been created
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllResidentNames(req, res, next) {
    //  these comes unwrapped from the JWT token
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
            else {
                return res.json(users.filter((user) => user.username == username));
            }
        })
        .catch(err => next(err));
}

function getAllUsers(req, res, next) {
    //  these comes unwrapped from the JWT token
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
    //  these comes unwrapped from the JWT token
    let { program } = req.user;
    userService.getByUsername(req.params.username, program)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function deleteUser(req, res, next) {
    //  these comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "deleting all records for username - " + req.params.username);
    userService.deleteUser(req.params.username)
        .then(() => res.json({}))
        .catch(err => next(err));
}