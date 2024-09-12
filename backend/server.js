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

app.post('/api/recommend', (req, res) => {
    const studentData = req.body;
    console.log("Received Student data:",studentData);
    // Extract necessary details
    const {
        grescore =0,
        ieltsscore=0,
        satscore=0,
        catscore=0,
        toeflscore=0,
        gmatscore=0,
        gatescore=0,
        maximum_tuitionfee_affordable=0
    } = studentData.score;

    // Path to the Python script
    const scriptPath = path.join(__dirname, 'recommend_colleges.py');
    
    // Create the command to run the Python script with the arguments
    const command = `python ${scriptPath} --students_path D:/HigherStudies/backend/user_data_mtech_recommendation_2000.csv --colleges_path D:/HigherStudies/backend/college_data_mtech_recommendation.csv --scaler_path D:/HigherStudies/backend/Scalar --grescore ${grescore} --ieltsscore ${ieltsscore} --satscore ${satscore} --catscore ${catscore} --toeflscore ${toeflscore} --gmatscore ${gmatscore} --gatescore ${gatescore} --maximum_tuitionfee_affordable ${200000}`;

    // Execute the Python script
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return res.status(500).send('Failed to run recommendation system');
        }
        if (stderr) {
            console.error(`Python script error: ${stderr}`);
            return res.status(500).send('Python script error');
        }
        console.log(`Python script output: ${stdout}`);
        try {
            const recommendations = JSON.parse(stdout);
            res.json(recommendations);
        } catch (parseError) {
            console.error('Error parsing recommendations:', parseError);
            res.status(500).send('Failed to parse recommendations');
        }
    });
});



app.get('/app', authMiddleware, (req, res) => {
    res.send('Welcome to the main page');
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

