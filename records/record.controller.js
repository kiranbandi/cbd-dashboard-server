const express = require('express');
const router = express.Router();
const recordService = require('./record.service');

// routes
router.get('/all/:username', getRecordByUserName);
router.post('/store', storeRecords);


module.exports = router;

function getRecordByUserName(req, res, next) {
    recordService.getRecordByUserName(req.params.username)
        .then(records => res.json(records))
        .catch(err => next(err));
}

function storeRecords(req, res, next) {
    recordService.createMultiple(req.body.recordsList)
        .then(response => res.json(response))
        .catch(err => next(err));
}