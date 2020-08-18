const db = require('../helpers/db');
const TaskList = db.TaskList;

module.exports = {
    getTaskListByUserName,
    storeTaskList
};

async function getTaskListByUserName(username, program) {
    return await TaskList.findOne({ username, program });
}

// update a record in the database but username cannot be changed 
async function storeTaskList(username, program, taskList) {
    let TaskListEntry = await TaskList.findOne({ username, program });
    // If a task list exists update it, if not create a new one
    if (TaskListEntry) {
        TaskListEntry = Object.assign(TaskListEntry, { taskList });
    } else {
        TaskListEntry = new TaskList({ username, program, taskList });
    }
    return await TaskListEntry.save();
}