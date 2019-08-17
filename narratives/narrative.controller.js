const router = require('express').Router();
const narrativeService = require('./narrative.service');

// routes
router.get('/all/:username', getNarrativesByUserName);
router.post('/store', storeNarratives);
router.delete('/delete-records/:username', deleteNarratives);

module.exports = router;

function getNarrativesByUserName(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { program } = req.user;
    narrativeService.getNarrativesByUserName(req.params.username, program)
        .then(narratives => res.json(narratives))
        .catch(err => next(err));
}

function storeNarratives(req, res, next) {
    // When data for a user is stored we need to over write the data
    // to do this we first delete all narratives for the given username
    // and then finally write the narratives
    let { username, yearTag, narrativesList } = req.body;
    narrativeService
        .deleteNarratives(username, yearTag)
        .then(() => narrativeService.createMultiple(narrativesList))
        .then(response => res.json(response))
        .catch(err => next(err));
}

function deleteNarratives(req, res, next) {
    narrativeService.deleteNarratives(req.params.username, 'all')
        .then(() => res.json({}))
        .catch(err => next(err));
}