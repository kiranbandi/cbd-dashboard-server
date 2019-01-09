const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, required: false },
    observation_date: { type: Date, default: Date.now },
    epa: { type: String, required: false },
    feedback: { type: String, required: false },
    observer_name: { type: String, required: false },
    observer_type: { type: String, required: false },
    professionalism_safety: { type: String, required: false },
    rating: { type: String, required: false },
    resident_name: { type: String, required: false },
    situation_context: { type: String, required: false },
    type: { type: String, required: false }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Record', schema);