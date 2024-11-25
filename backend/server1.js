const express = require('express');
const mongoose = require('mongoose');
const Register = require('./models/Register');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true
}));

app.use(express.json());

mongoose.connect('mongodb+srv://bhuvaneshg:deepakbhuvi@cluster0.e2m47pj.mongodb.net/HigherStudies?retryWrites=true&w=majority&appName=Cluster0', {
    connectTimeoutMS:50000,
    socketTimeoutMS:50000,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Register({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'User Already Exists' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/confirm-password', async (req, res) => {
  const { email, newPassword } = req.body;
  console.log(email+" "+newPassword);
  try {
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Error updating password' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
