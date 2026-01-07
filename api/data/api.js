import { Router } from 'express';
import DataModel from './model.js';
import RegisterModel from '../auth/model.js';
import { Types } from 'mongoose';

const { ObjectId } = Types;

const router = Router();

router.get('/data', async (req, res) => {
    try {
        const data = await DataModel.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/data', async (req, res) => {
    try {
        const newStudent = new DataModel(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/data/:id', async (req, res) => {
    try {
        const updatedStudent = await DataModel.findByIdAndUpdate(
            new ObjectId(req.params.id),
            req.body,
            { new: true }
        );
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/data/:id', async (req, res) => {
    try {
        await DataModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/auth', async (req, res) => {
  const user = await RegisterModel.findById(req.user.id).select("-password");
  res.json(user);
});

router.post('/pwd-reset', async (req, res) => {
  const { newPassword } = req.body;
  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    await RegisterModel.findByIdAndUpdate(req.user.id, {
      password: hashed,
    });

    res.json({ message: "Password updated successfully" });
  } 
  catch {
    res.status(500).json({ error: "Error updating password" });
  }
});

export default router;