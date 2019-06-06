const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    // accessType can be super-admin,admin,Program Director,
    //  Reviewer (CC Member), supervisor or resident 
    accessType: { type: String, required: true },
    accessList: { type: String, required: false },
    createdDate: { type: Date, default: Date.now },
    uploadedData: { type: Date, default: Date.now },
    currentPhase: { type: String },
    promotedDate: { type: Array },
    programStartDate: { type: Date, default: Date.now },
    rotationSchedule: { type: Object },
    longitudinalSchedule: { type: Object },
    citeExamScore: { type: Object }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);