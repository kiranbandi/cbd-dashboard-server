const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The username and program combined together needed to be unique
// the same nsid can have different profiles for different programs 
const schema = new Schema({
    username: { type: String, required: true },
    // currently can be EM,OBGYN,ANESTHESIA,PATH or IM
    program: { type: String, required: true },
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    // accessType can be one of the following
    // superadmin (can switch between programs and must be created by code manually currently) 
    // admin (admins for each individual program)
    // director (Program director who has access to all dashboards)
    // reviewer (CC member who has access to all residents in the program)
    // supervisor (Academic Advisor who has access to a couple of residents) 
    // resident (basic resident profile for whom records can be set) 
    accessType: { type: String, required: true },
    accessList: { type: String, required: false },
    createdDate: { type: Date, default: Date.now },
    uploadedData: { type: Date, default: Date.now },
    currentPhase: { type: String },
    promotedDate: { type: Array },
    programStartDate: { type: Date, default: Date.now },
    rotationSchedule: { type: Object },
    longitudinalSchedule: { type: Object },
    citeExamScore: { type: Object },
    oralExamScore: { type: Object },
    ccFeedbackList: { type: Array },
    // flag to indicate when a user has moved out or graduated from the program
    isGraduated: { type: Boolean }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);