const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dataRoutes = require('./routes/data');

const app = express();
const port = process.env.PORT || 5002;
const authMiddleware = require('./authtoken');



app.use(cors());
app.use(express.json());


app.get('/app', authMiddleware, (req, res) => {
    res.send('Welcome to the main page');
});

mongoose.connect('mongodb+srv://bhuvaneshg:deepakbhuvi@cluster0.e2m47pj.mongodb.net/HigherStudies?retryWrites=true&w=majority&appName=Cluster0', {
    connectTimeoutMS:30000,
    socketTimeoutMS:45000,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));


app.use('/api/data', dataRoutes); 


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

