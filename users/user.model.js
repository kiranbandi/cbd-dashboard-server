const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    // the password is stored as a hash 
    hash: { type: String, required: true },
    // accessType can be admin, resident, supervisor
    accessType: { type: String, required: true },
    accessList: { type: String, required: false },
    createdDate: { type: Date, default: Date.now },
    uploadedData: { type: Date, default: Date.now },
    currentPhase: { type: String },
    programStartDate: { type: Date, default: Date.now },
    rotationSchedule: { type: String }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);