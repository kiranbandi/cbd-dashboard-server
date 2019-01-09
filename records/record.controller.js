const express = require('express');
const router = express.Router();
const recordService = require('./record.service');

// routes
router.get('/username', authenticate);

module.exports = router;

function getAllResidents(req, res, next) {
    recordService.getAllResidents()
        .then(users => res.json(users))
        .catch(err => next(err));
}