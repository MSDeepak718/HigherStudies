const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
} ,{collection:'Register'});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
