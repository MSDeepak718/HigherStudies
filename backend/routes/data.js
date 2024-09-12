const express = require('express');
const DataModel = require('../models/DataModel');
const { ObjectId } = require('mongoose').Types; // Import ObjectId
const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
    try {
        const data = await DataModel.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new student
router.post('/', async (req, res) => {
    console.log('Received post request with data:', req.body); // Debugging line
    try {
        const newStudent = new DataModel(req.body); // Create a new DataModel instance with the request body
        const savedStudent = await newStudent.save(); // Save the new student to the database
        console.log('New student added:', savedStudent); // Debugging line
        res.status(201).json(savedStudent); // Respond with the created student and status code 201
    } catch (err) {
        res.status(400).json({ message: err.message }); // Respond with a 400 status code if there's an error
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
