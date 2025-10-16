const db = require('../helpers/mariadb');
const TaskList = db.TaskList;

module.exports = {
    getTaskListByUserName,
    storeTaskList
};

async function getTaskListByUserName(username, program) {
    return await TaskList.findOne({ where: { username, program } });
}

// update a record in the database but username cannot be changed 
async function storeTaskList(username, program, taskList) {
    let TaskListEntry = await TaskList.findOne({ where: { username, program } });
    // If a task list exists update it, if not create a new one
    if (TaskListEntry) {
        await TaskListEntry.update({ taskList });
    } else {
        TaskListEntry = await TaskList.create({ username, program, taskList });
    }
    return TaskListEntry;
}