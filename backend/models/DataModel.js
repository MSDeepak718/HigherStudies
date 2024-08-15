const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
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
    preferredDegree: {
        type: String,
        required: true
    },
    preferredCourse: {
        type: String,
        required: true
    },
    preferredCountry: {
        type: String,
        required: true
    }
}, { collection: 'homepage' }); 

const DataModel = mongoose.model('Data', DataSchema);

module.exports = DataModel;
