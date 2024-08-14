const express = require('express');
const DataModel = require('../models/DataModel');

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const data = await DataModel.find();
        console.log(data);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
