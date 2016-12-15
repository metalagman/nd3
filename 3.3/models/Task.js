const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    name: String,
    description: String,
    is_open: Boolean,
    user_id: String
});

module.exports = mongoose.model('Task', Schema);