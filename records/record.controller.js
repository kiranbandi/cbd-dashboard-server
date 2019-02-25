const moment = require('moment');
const express = require('express');
const router = express.Router();
const recordService = require('./record.service');
const userService = require('../users/user.service');

// routes
router.get('/all/:username', getRecordByUserName);
router.post('/store', storeRecords);
router.delete('/delete-records/:username', deleteRecords);


module.exports = router;

function getRecordByUserName(req, res, next) {
    recordService.getRecordByUserName(req.params.username)
        .then(records => res.json(records))
        .catch(err => next(err));
}

function storeRecords(req, res, next) {
    // When data for a user is stored we need to over write the data
    // to do this we first delete all records for the given username
    // and then store the new upload date into the user table 
    // and then finally write the records
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