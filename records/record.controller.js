const moment = require('moment');
const express = require('express');
const router = express.Router();
const recordService = require('./record.service');
const userService = require('../users/user.service');
const winston = require('winston');

// routes
router.get('/all/:username', getRecordByUserName);
router.get('/all-observers', getAllObservers);
router.post('/observer', getRecordsByObserverName);
router.post('/store', storeRecords);
router.delete('/delete-records/:username', deleteRecords);
router.get('/data-dump', getAllRecords);

module.exports = router;

function getRecordByUserName(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "Request to access records of " + req.params.username);
    recordService.getRecordByUserName(req.params.username)
        .then(records => res.json(records))
        .catch(err => next(err));
}

function getRecordsByObserverName(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "Request to access records of observer with name " + req.params.observername);
    recordService.getRecordsByObserverName(req.body.observername)
        .then(records => res.json(records))
        .catch(err => next(err));
}

function getAllObservers(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username } = req.user;
    winston.info(username + " -- " + "Request to access list of all observers ");
    recordService.getAllObserversList()
        .then(list => res.json(list))
        .catch(err => next(err));
}

function getAllRecords(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, accessType } = req.user;
    winston.info(username + " -- " + "Request for Data Dump");

    if (accessType == 'admin' || accessType == 'reviewer') {
        recordService.getAllRecords()
            .then(records => res.json(records))
            .catch(err => next(err));
    } else {
        res.status(401).json({ message: 'Unauthorized Access' });
    }
}

function storeRecords(req, res, next) {
    // When data for a user is stored we need to over write the data
    // to do this we first delete all records for the given username
    // and then store the new upload date into the user table 
    // and then finally write the records
    let { username } = req.user;
    winston.info(username + " -- " + "Request to store records for " + req.body.username);

    recordService
        .deleteRecords(req.body.username)
        .then(() => userService.update(req.body.username, { uploadedData: moment().format('MM/DD/YYYY') }))
        .then(() => recordService.createMultiple(req.body.recordsList))
        .then(response => res.json(response))
        .catch(err => next(err));
}

function deleteRecords(req, res, next) {
    recordService.deleteRecords(req.params.username)
        .then(() => res.json({}))
        .catch(err => next(err));
}