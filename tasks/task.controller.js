const router = require('express').Router();
const taskService = require('./task.service');
const winston = require('winston');

// routes
router.get('/all/:username', getTaskListByUserName);
router.post('/store', storeTaskList);

module.exports = router;

function getTaskListByUserName(req, res, next) {
    //  this comes unwrapped from the JWT token
    let { username, accessType, program } = req.user;

    if (['admin', 'super-admin'].indexOf(accessType) > -1 || username == req.params.username) {
        winston.info(username + " -- " + program + " -- " + "Request to access task list of " + req.params.username);
        taskService.getTaskListByUserName(req.params.username, program)
            .then(taskList => res.json(taskList))
            .catch(err => next(err));
    } else {
        res.status(401).json({ message: 'Unauthorized Access' });
    }
}

function storeTaskList(req, res, next) {
    let { taskList } = req.body, { username, accessType, program } = req.user;

    if (['admin', 'super-admin'].indexOf(accessType) > -1 || username == req.body.username) {
        winston.info(username + " -- " + program + " -- " + "Request to update task list of " + req.body.username);

        taskService
            .storeTaskList(req.body.username, program, taskList)
            .then(response => res.json(response))
            .catch(err => next(err));
    } else {
        res.status(401).json({ message: 'Unauthorized Access' });
    }

}