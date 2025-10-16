const config = require('../config');
const jwt = require('jsonwebtoken');
const db = require('../helpers/mariadb');
const recordService = require('../records/record.service');
const narrativeService = require('../narratives/narrative.service');
const winston = require('winston');
const { Op } = require('sequelize');

const User = db.User;

module.exports = {
    authenticate,
    reIssueToken,
    getAllResidentNames,
    getAllResidentNamesAcrossPrograms,
    getAllUsers,
    create,
    getByUsername,
    update,
    updateCCFeedbackList,
    updateExamscore,
    updateCompletionStatus,
    deleteUser
};

async function authenticate(username) {
    let users = await User.findAll({ where: { username } });
    // If a user doesnt exist ask him to get registered
    winston.info(username + " -- " + "Request to login");

    if (users.length == 0) throw Error(("Sorry but we don't have your information on record. Please get in touch with your program administrator to get onboarded. Alternatively you can drop a mail to venkat.bandi@usask.ca for assistance."));

    // get the list of programs the user has access to 
    let programList = [];
    if (users.length > 0) {
        programList = users.map((d) => d.program);
        // set the user list to the first user and 
        // then pass in the list of programs he has access to
        user = users[0];
    }

    // return a signed token once authentication is complete and user is in our database
    const { accessType, accessList = '', program } = user;
    // if a person has no program mapped to him them throw an error
    if (!program) throw Error("Sorry but you are not mapped to any department. Please use the Contact Us below to get in touch with us so we can rectify this issue.");
    // token has the username,accessType , program the user belongs to and the list of residents user can access
    const token = jwt.sign({ username, accessType, accessList, program, programList }, config.key);
    return {
        username,
        accessType,
        accessList,
        program,
        token,
        programList
    };
}

async function reIssueToken(username, program) {
    let users = await User.findAll({ where: { username } });
    // If a user doesnt exist ask him to get registered
    if (!users || users.length === 0) throw Error("Sorry but we don't have your information on record.");
    // If there are multiple user profiles
    // get a list of programs the user has profiles in 
    // and a list of accessTypes the user has
    let programList = [];
    if (users.length > 0) {
        programList = users.map((d) => d.program);
        const accessTypeList = users.map((d) => d.accessType);
        // if a user has a super admin profile use it and reissue token for the selected program 
        if (accessTypeList.indexOf('super-admin') > -1) {
            user = users[accessTypeList.indexOf('super-admin')];
        }
        // if not check if the selected program is in the list of user profiles and if not return unauthorized  
        else if (programList.indexOf(program) > -1) {
            user = users[programList.indexOf(program)];
        }
        else {
            throw Error("Sorry but you are not authorized to perform this action.");
        }
    }
    // If there is only one user profile then check if the user is 
    // super admin if yes reissue token for the selected program, 
    // if not the user is not permitted for the selected action since he cannot switch programs
    else {
        if (users[0].accessType != 'super-admin') {
            throw Error("Sorry but you are not authorized to perform this action.");
        }
    }
    // once the desired user profile has been found and set
    // get its corresponding accessType and accessList and set them in the token
    let { accessType, accessList } = user;

    // token has the username,accessType , program the user belongs to and the list of residents user can access
    const token = jwt.sign({ username, program, accessType, accessList, programList }, config.key);
    return {
        username,
        program,
        token,
        accessType,
        accessList,
        programList
    };

}

// show all residents in the user's program
async function getAllResidentNames(program) {
    return await User.findAll({ 
        where: { accessType: 'resident', program },
        attributes: ["username", "fullname", "uploadedData", "currentPhase", "programStartDate", "rotationSchedule", "ccFeedbackList", "oralExamScore", "isGraduated", "promotedDate", "completionStatus"]
    });
}

// show all residents across all programs
async function getAllResidentNamesAcrossPrograms() {
    return await User.findAll({ 
        where: { accessType: 'resident' },
        attributes: ["username", "program", "currentPhase", "programStartDate", "rotationSchedule", "ccFeedbackList", "isGraduated"]
    });
}

// show all users in the user's program
async function getAllUsers(program) {
    return await User.findAll({ 
        where: { program },
        attributes: ["username", "accessType", "fullname"]
    });
}

// show data for a particular user
async function getByUsername(username, program) {
    return await User.findOne({ where: { username, program } });
}

// register a user in the database
async function create(userParam) {
    // first check if the username is already in use in that program
    // if so throw an error if not proceed
    let existingUser = await User.findOne({ where: { username: userParam.username, program: userParam.program } });
    // check for existing users
    if (existingUser) throw Error(('Sorry but a profile exists for this NSID already in this program.'));
    // paranoid check so super admins are not created by breaking API
    if (userParam.accessType == 'super-admin') throw Error("Unauthorized Action");
    // create a new user
    await User.create(userParam);
}

// update a record in the database but username cannot be changed 
async function update(username, program, userParam) {
    let user = await User.findOne({ where: { username, program } });
    // validate
    if (!user) throw Error('User not found');
    // paranoid check so super admins are not created/updated by breaking API
    if (userParam.accessType == 'super-admin') throw Error("Unauthorized Action");
    // copy userParam properties to user
    await user.update(userParam);
}

// update a record in the database but username cannot be changed 
async function updateCCFeedbackList(username, program, ccFeedbackList) {
    let user = await User.findOne({ where: { username, program } });
    // validate
    if (!user) throw Error('User not found');
    // copy userParam properties to user
    return await user.update({ ccFeedbackList });
}

// update a record in the database but username cannot be changed 
async function updateExamscore(username, program, oralExamScore, citeExamScore) {
    let user = await User.findOne({ where: { username, program } });
    // validate
    if (!user) throw Error('User not found');
    // copy userParam properties to user
    return await user.update({ oralExamScore, citeExamScore });
}

// update a record in the database but username cannot be changed 
async function updateCompletionStatus(username, program, completionStatus) {
    let user = await User.findOne({ where: { username, program } });
    // validate
    if (!user) throw Error('User not found');
    // copy userParam properties to user
    return await user.update({ completionStatus });
}

// find a record by username and then delete it
async function deleteUser(username, program) {
    // first delete all the resident records against the given username
    await recordService.deleteRecords(username, program)
    // then delete all the resident narratives against the given username
    await narrativeService.deleteNarratives(username, program)
    // then delete the actual user record
    await User.destroy({ where: { username, program } });
}