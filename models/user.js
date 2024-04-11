const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    isAdmin: { type: Boolean },
    lastLogin: { type: String },
    apiToken: { type: String },
}, { timestamps: true, collection: 'users' });

module.exports = mongoose.model('User', UserSchema);