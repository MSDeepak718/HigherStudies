const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    }
}, { collection: 'StudentData' }); 

const DataModel = mongoose.model('Data', DataSchema);

module.exports = DataModel;
