const express = require('express');
const DataModel = require('../models/DataModel');
const { ObjectId } = require('mongoose').Types; // Import ObjectId
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await DataModel.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a student's details
router.put('/:id', async (req, res) => {
    console.log('Received update request with data:', req.body); // Debugging line
    try {
        const updatedStudent = await DataModel.findByIdAndUpdate(
            new ObjectId(req.params.id),
            req.body,
            { new: true } // Return the updated document
        );
        console.log('Updated student:', updatedStudent); // Debugging line
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a student
router.delete('/:id', async (req, res) => {
    try {
        await DataModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
