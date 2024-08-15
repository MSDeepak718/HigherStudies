import React, { useState } from 'react';
import StudentProfile from './components/StudentProfile';

function App() {
  const [studentData, setStudentData] = useState({
    name: "Deepak",
    registrationNo: "23AD029",
    department: "Artificial Intelligence and Data Science",
    dob: "01/01/2000",
    gender: "Male",
    email: "deepak@example.com",
    leetCodeProblems: 150,
    leetCodeRating: 1800,
    gateScore: 780,
    greScore: 320,
    gmatScore: 650,
    preferredCountry: "USA",
    researchPapers: 3,
    projects: 5,
    internship: "ABC Corp, Data Science Intern",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    extraCurricular: "Football, Coding Club",
    codeChefRating: 2200,
    languagesKnown: ["Python", "Java", "C++"]
  });

  const handleUpdateStudent = (updatedData) => {
    setStudentData(updatedData);
  };

  return (
    <div className="App">
      <StudentProfile student={studentData} onUpdate={handleUpdateStudent} />
    </div>
  );
}

export default App;
