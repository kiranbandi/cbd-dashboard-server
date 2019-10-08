const config = require('../config');
const jwt = require('jsonwebtoken');
const db = require('../helpers/db');
const recordService = require('../records/record.service');
const narrativeService = require('../narratives/narrative.service');

const User = db.User;

module.exports = {
    authenticate,
    reIssueToken,
    getAllResidentNames,
    getAllUsers,
    create,
    getByUsername,
    update,
    updateCCFeedbackList,
    updateExamscore,
    deleteUser
};

async function authenticate(username) {
    const user = await User.findOne({ username });
    // If a user doesnt exist ask him to get registered
    if (!user) throw Error(("Sorry but we don't have your information on record.Please get in touch with your program administrator to get onboarded.Alternatively you can drop a mail to venkat.bandi@usask.ca for assistance."));
    // return a signed token once authentication is complete and user is in our database
    const { accessType, accessList = '', program } = user.toObject();
    // if a person has no program mapped to him them throw an error
    if (!program) throw Error("Sorry but you are not mapped to any department.Please use the Contact Us below to get in touch with us so we rectify this issue.");
    // token has the username,accessType , program the user belongs to and the list of residents user can access
    const token = jwt.sign({ username, accessType, accessList, program }, config.key);
    return {
        username,
        accessType,
        accessList,
        program,
        token
    };
}

async function reIssueToken(username, program) {
    const user = await User.findOne({ username });
    // If a user doesnt exist ask him to get registered
    if (!user) throw Error("Sorry but we don't have your information on record.");
    // return a signed token once authentication is complete
    const { accessType, accessList } = user.toObject();
    // token mapped to a different program can be reissued only for superadmins in the DB
    if (accessType !== 'super-admin') throw Error("Sorry but you are not authorized to perform this action.");
    // token has the username,accessType , program the user belongs to and the list of residents user can access
    const token = jwt.sign({ username, accessType, accessList, program }, config.key);
    return {
        username,
        accessType,
        accessList,
        program,
        token
    };
}

// show all residents in the user's program
async function getAllResidentNames(program) {
    return await User.find({ accessType: 'resident', program },
        "username fullname uploadedData currentPhase programStartDate rotationSchedule longitudinalSchedule citeExamScore ccFeedbackList oralExamScore isGraduated promotedDate");
}

// show all users in the user's program
async function getAllUsers(program) {
    return await User.find({ program }, "username accessType fullname");
}

// show data for a particular user
async function getByUsername(username, program) {
    return await User.findOne({ username, program });
}

// register a user in the database
async function create(userParam) {
    // first check if the username is already in use 
    // if so throw an error if not proceed
    let existingUser = await User.findOne({ 'username': userParam.username });
    // check for existing users
    if (existingUser) throw Error(('Sorry but a profile exists for this NSID already in the ' + existingUser._doc.program.toUpperCase() + " program. Use the Contact Us below if you want this person's acess to be overwritten to your department."));
    // paranoid check so super admins are not created by breaking API
    if (userParam.accessType == 'super-admin') throw Error("Unauthorized Action");
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
    // paranoid check so super admins are not created/updated by breaking API
    if (userParam.accessType == 'super-admin') throw Error("Unauthorized Action");
    // copy userParam properties to user
    user = Object.assign(user, userParam);
    await user.save();
}

// update a record in the database but username cannot be changed 
async function updateCCFeedbackList(username, ccFeedbackList) {
    let user = await User.findOne({ username });
    // validate
    if (!user) throw Error('User not found');
    // copy userParam properties to user
    user = Object.assign(user, { ccFeedbackList });
    return await user.save();
}

// update a record in the database but username cannot be changed 
async function updateExamscore(username, oralExamScore, citeExamScore) {
    let user = await User.findOne({ username });
    // validate
    if (!user) throw Error('User not found');
    // copy userParam properties to user
    user = Object.assign(user, { oralExamScore, citeExamScore });
    return await user.save();
}

// find a record by username and then delete it
async function deleteUser(username) {
    // first delete all the resident records against the given username
    await recordService.deleteRecords(username)
        // then delete all the resident narratives against the given username
    await narrativeService.deleteNarratives(username)
        // then delete the actual user record
    await User.deleteOne({ username });
}