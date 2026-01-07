import { Schema, model } from 'mongoose';

const DataSchema = new Schema({
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
    maxfee:{
        type:Number
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
    cgpa:{
        type:Number
    },
    numberofresearchpapers:{
        type:Number
    },
    numberofprojects:{
        type:Number
    },
    score: {
        type: Map,
        of: Number
    }
}, { collection: 'StudentData' });

const DataModel = model('Data', DataSchema);

export default DataModel;
