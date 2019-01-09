const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAllResidents,
    create
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        // return a signed token once authentication is complete
        const userObject = user.toObject();
        const token = jwt.sign({ username }, config.key);

        return {
            username: userObject.username,
            accessType: userObject.accessType,
            token
        };
    }
}

async function getAllResidents() {
    return await User.find({ accessType: 'resident' }).select('username');
}

async function create(userParam) {
    // hash password
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
    // create a new user
    const user = new User(userParam);
    // save user
    await user.save();
}