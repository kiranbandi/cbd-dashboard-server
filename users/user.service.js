const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const recordService = require('../records/record.service');
const User = db.User;

module.exports = {
    authenticate,
    getAllResidentNames,
    getAllNames,
    create,
    getByUsername,
    update,
    deleteUser
};

async function authenticate(username) {

    const user = await User.findOne({ username });

    if (user) {
        // return a signed token once authentication is complete
        const { accessType, accessList = '', ...others } = user.toObject();
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
    return await User.find({ accessType: 'resident' }, "username fullname uploadedData currentPhase programStartDate rotationSchedule longitudinalSchedule citeExamScore");
}

// show all users
async function getAllNames() {
    return await User.find({}, "username");
}

// show data for a particular user
async function getByUsername(username) {
    return await User.findOne({ username });
}

// register a user in the database
async function create(userParam) {
    // hash password
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
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
    // hash password if it was entered
    if (userParam.password && userParam.password.length > 0) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // copy userParam properties to user
    user = Object.assign(user, userParam);
    await user.save();
}

// find a record by username and then delete it
async function deleteUser(username) {
    // first delete all the resident records against the given username
    await recordService.deleteRecords(username)
        // then delete the actual user record
    await User.findOne({ username }).remove();
}