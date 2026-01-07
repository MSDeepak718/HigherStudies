import { Router } from 'express';
import RegisterModel from './model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const secret = process.env.SECRET;

router.post('/signup', async (req, res) => {

  const { email, password } = req.body;

  try {

    const isExisting = await RegisterModel.findOne({ email });
    if(isExisting){
        return res.status(409).json({error: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await RegisterModel.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'User Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration Failed'});
  }
});

router.post('/login', async (req, res) => {
  console.log(secret);
  const { email, password } = req.body;
  try {
    const user = await RegisterModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Password' });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        secret,
        {expiresIn: "1h"}
    );

    res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error logging in' });
  }
});

router.post("/logout", (req, res) => {
    res.clearCookie("access_token", { path: "/" });
    res.json({ message: "Logged out" });
});

export default router;