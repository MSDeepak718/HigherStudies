const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    studentid: {
        type: String,
        required: true,
        unique: true
    },
    studentname: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    emailid: {
        type: String,
        required: true
    },
    arrearstatus: {
        type: String,
        required: true
    },
    preferreddegree: {
        type: String,
        required: true
    },
    preferredcourse: {
        type: String,
        required: true
    },
    preferredcountry: {
        type: String,
        required: true
    },
    score: {
        type: Map,
        of: Number
    }
}, { collection: 'StudentData' });

const DataModel = mongoose.model('Data', DataSchema);

module.exports = DataModel;
