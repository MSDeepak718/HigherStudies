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
<<<<<<< HEAD
}, { collection: 'homepage' }); 
=======
}, { collection: 'StudentData' });
>>>>>>> c16013e9fbaaf6af9a78cf271e2205acbe0ad661

const DataModel = mongoose.model('Data', DataSchema);

module.exports = DataModel;
