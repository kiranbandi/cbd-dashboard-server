const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, required: true },
    // currently can be EM,OBGYN,ANESTHESIA,PATH or IM
    program: { type: String, required: true },
    resident_name: { type: String, required: true },
    observer_name: { type: String, required: true },
    observer_type: { type: String, required: false },
    feedback: { type: String, required: false },
    professionalism_safety: { type: String, required: false },
    observation_date: { type: String, required: true },
    completion_date: { type: String, required: true },
    year_tag: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Narrative', schema);