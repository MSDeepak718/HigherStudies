const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dataRoutes = require('./routes/data');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5002;
const authMiddleware = require('./authtoken');


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get('/app', authMiddleware, (req, res) => {
    res.send('Welcome to the main page');
});
app.get("/start-streamlit", (req, res) => {
    exec("cd kutty && cd src && streamlit run app.py", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
  });
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

