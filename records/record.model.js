const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, required: true },
    // currently can be EM,OBGYN,ANESTHESIA,PATH or IM
    program: { type: String, required: true },
    observation_date: { type: String, required: true },
    year_tag: { type: String, required: true },
    epa: { type: String, required: true },
    feedback: { type: String, required: false },
    observer_name: { type: String, required: true },
    observer_type: { type: String, required: false },
    professionalism_safety: { type: String, required: false },
    rating: { type: String },
    resident_name: { type: String, required: true },
    situation_context: { type: String, required: false },
    type: { type: String, required: false },
    isExpired: { type: Boolean },
    phaseTag: { type: String },
    rotationTag: { type: String }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Record', schema);