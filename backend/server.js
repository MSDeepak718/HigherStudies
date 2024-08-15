const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dataRoutes = require('./routes/data');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://bhuvaneshg:deepakbhuvi@cluster0.e2m47pj.mongodb.net/HigherStudies?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

// Routes
app.use('/api/data', dataRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
