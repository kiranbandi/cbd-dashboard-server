const moment = require('moment');
const express = require('express');
const router = express.Router();
const recordService = require('./record.service');
const userService = require('../users/user.service');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
var parse = require('csv-parse');

// routes
router.get('/all/:username', getRecordByUserName);
router.get('/all-observers', getAllObservers);
router.post('/observer', getRecordsByObserverName);
router.post('/getRecordsByYear', getRecordsByYear);
router.post('/store', storeRecords);
router.delete('/delete-records/:username', deleteRecords);
router.get('/data-dump', getAllRecords);
router.get('/data-dump-ug', getUGData);


module.exports = router;


function getUGData(req, res, next) {

    var csvData = [];
    fs.createReadStream(path.join(__dirname, '../', 'data.csv'))
        .pipe(parse({ delimiter: ',' }))
        .on('data', function(csvrow) {
            //do something with csvrow
            csvData.push(csvrow);
        })
        .on('end', function() {
            //do something wiht csvData
            res.json({ 'file': csvData });
        })
        .on('error', function(err) {
            res.status(500).json({ message: 'Error parsing data' });
        })
}



function getRecordByUserName(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Request to access records of " + req.params.username);
    recordService.getRecordByUserName(req.params.username, program)
        .then(records => res.json(records))
        .catch(err => next(err));
}

function getRecordsByObserverName(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Request to access records of observer with name " + req.body.observername);
    recordService.getRecordsByObserverName(req.body.observername, program)
        .then(records => res.json(records))
        .catch(err => next(err));
}

function getAllObservers(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Request to access list of all observers ");
    recordService.getAllObserversList(program)
        .then(list => res.json(list))
        .catch(err => next(err));
}


function getRecordsByYear(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, accessType, program } = req.user, { academicYear, programSpecific = true } = req.body;
    winston.info(username + " -- " + program + " -- " + "Request for Data from year " + academicYear);
    if (['admin', 'super-admin', 'director'].indexOf(accessType) > -1) {

        // If an admin or director is accessing the data then force set the program 
        if (accessType == 'admin') {
            programSpecific = true;
        }

        recordService.getRecordsByYear(academicYear, programSpecific, program)
            .then(records => res.json(records))
            .catch(err => next(err));
    } else {
        res.status(401).json({ message: 'Unauthorized Access' });
    }
}

function getAllRecords(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, accessType, program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Request for Data Dump");
    if (['admin', 'super-admin', 'director', 'supervisor', 'reviewer'].indexOf(accessType) > -1) {
        recordService.getAllRecords(program)
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
    let { username, yearTag, recordsList } = req.body, { program } = req.user;
    winston.info(username + " -- " + program + " -- " + "Request to store records for " + req.body.username);

    // set the program on all records based on the user program 
    recordsList.map((record) => { record.program = program });

    if (program == 'UNDERGRADUATE' && req.body.username == 'all') {

        recordService
            .deleteUGRecords('UNDERGRADUATE', yearTag)
            .then(() => recordService.createMultiple(recordsList))
            .then(response => res.json(response))
            .catch(err => next(err));

    } else {

        recordService
            .deleteRecords(username, yearTag)
            .then(() => userService.update(username, { uploadedData: moment().format('MM/DD/YYYY') }))
            .then(() => recordService.createMultiple(recordsList))
            .then(response => res.json(response))
            .catch(err => next(err));

    }



}

function deleteRecords(req, res, next) {
    recordService.deleteRecords(req.params.username, 'all')
        .then(() => res.json({}))
        .catch(err => next(err));
}
