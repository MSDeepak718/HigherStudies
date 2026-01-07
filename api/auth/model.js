import { Schema, model } from 'mongoose';

const registerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
} ,{collection:'Register', timestamps: true});

const RegisterModel = model('Register', registerSchema);

export default RegisterModel;

