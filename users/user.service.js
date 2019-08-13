const config = require('../config');
const jwt = require('jsonwebtoken');
const db = require('../helpers/db');
const recordService = require('../records/record.service');
const narrativeService = require('../narratives/narrative.service');

const User = db.User;

module.exports = {
    authenticate,
    getAllResidentNames,
    getAllUsers,
    create,
    getByUsername,
    update,
    deleteUser
};

async function authenticate(username) {

    const user = await User.findOne({ username });

    if (user) {
        // return a signed token once authentication is complete
        const { accessType, accessList = '' } = user.toObject();
        // token has the username his accessType and the list of residents he can access
        const token = jwt.sign({ username, accessType, accessList }, config.key);
        return {
            username,
            accessType,
            accessList,
            token,
            isRegistered: true
        };
    }
    return {
        isRegistered: false
    };
}

// show users who have accessType set to residents 
async function getAllResidentNames() {
    return await User.find({ accessType: 'resident' },
        "username fullname uploadedData currentPhase programStartDate rotationSchedule longitudinalSchedule citeExamScore oralExamScore isGraduated promotedDate");
}

// show all users
async function getAllUsers() {
    return await User.find({}, "username accessType fullname");
}

// show data for a particular user
async function getByUsername(username) {
    return await User.findOne({ username });
}

// register a user in the database
async function create(userParam) {
    // create a new user
    const user = new User(userParam);
    // save user
    await user.save();
}

// update a record in the database but username cannot be changed 
async function update(username, userParam) {
    let user = await User.findOne({ username });
    // validate
    if (!user) throw Error('User not found');
    // copy userParam properties to user
    user = Object.assign(user, userParam);
    await user.save();
}

// find a record by username and then delete it
async function deleteUser(username) {
    // first delete all the resident records against the given username
    await recordService.deleteRecords(username)
        // then delete all the resident narratives against the given username
    await narrativeService.deleteNarratives(username)
        // then delete the actual user record
    await User.findOne({ username }).remove();
}