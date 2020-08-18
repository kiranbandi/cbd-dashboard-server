const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// The schema is more for one task list than one individual task
//  easier to handle this way :-(
const schema = new Schema({
    username: { type: String, required: true },
    taskList: { type: Array },
    program: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TaskList', schema);