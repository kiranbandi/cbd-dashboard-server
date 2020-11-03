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
router.get('/residents-all', getAllResidentNamesAcrossPrograms);
router.post('/reissuetoken', reIssueToken);
router.post('/register', checkAccess, register);
router.post('/update/:username', checkAccess, update);
router.post('/update-cc-feedback/:username', checkAccess, updateCCFeedbackList);
router.post('/update-exam-score/:username', checkAccess, updateExamscore);
router.get('/all', checkAccess, getAllUsers);
router.get('/:username', checkAccess, getByUsername);
router.delete('/:username', checkAccess, deleteUser);


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
    winston.info(username + " -- " + program + " -- " + "Request for list of residents");
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

function getAllResidentNamesAcrossPrograms(req, res, next) {
    //  these come unwrapped from the JWT token
    let { username, accessType } = req.user;
    winston.info(username + " -- " + "Request for list of residents across all programs");
    if (accessType == 'super-admin' || accessType == 'director') {
        userService.getAllResidentNamesAcrossPrograms()
            .then(users => res.json(users))
            .catch(err => next(err));
    } else { res.status(401).json({ message: 'Unauthorized Access' }) }
}


function register(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Request to create new user");

    userService.create({...req.body, program })
        // no message to send , if there is no error the UI simply shows that user has been created
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllUsers(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { program } = req.user;
    userService.getAllUsers(program)
        // remove super-admins , they can only be set via direct DB access
        .then(users => res.json(users.filter((d) => d.accessType != 'super-admin')))
        .catch(err => next(err));
}

function update(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { program } = req.user;
    userService.update(req.params.username, program, req.body)
        .then((data) => res.json({ data }))
        .catch(err => next(err));
}

function updateCCFeedbackList(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Updating CC records for username - " + req.params.username);
    userService.updateCCFeedbackList(req.params.username, program, req.body.ccFeedbackList)
        .then((data) => res.json({ data }))
        .catch(err => next(err));
}

function updateExamscore(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Updating Examscores for username - " + req.params.username);
    userService.updateExamscore(req.params.username, program, req.body.oralExamScore, req.body.citeExamScore)
        .then((data) => res.json({ data }))
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
    let { username, program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Deleting all records for username - " + req.params.username);
    userService.deleteUser(req.params.username, program)
        .then(() => res.json({}))
        .catch(err => next(err));
}

// called when super admins want to switch between programs and so get a new token
// remapped to a different program
function reIssueToken(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "request to switch programs");
    userService.reIssueToken(username, req.body.program)
        .then(user => res.json(user))
        .catch(err => next(err));
}

function checkAccess(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { accessType } = req.user;
    if (accessType == 'admin' || accessType == 'director' || accessType == 'super-admin' || accessType == 'reviewer') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized Access' });
    }
}