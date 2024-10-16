import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './StudentProfile.css';
import image from './Assets/logo.png';

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { student } = location.state || {};
  const [loading,setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([]);
  const [editableStudent, setEditableStudent] = useState(student);
  const [isEditing, setIsEditing] = useState(false);


  // Initialize variables
  const maxfee = student?.maxfee || 0; // Set a default or pull from student object
  const cgpa = student?.cgpa || 0;
  const preferredcountry = student?.preferredcountry || ""; // Default or from student
  const preferreddegree = student?.preferreddegree || ""; // Default or from student
  const score = student?.score || {}; // Ensure score exists

  const handleReturn = () => {
    navigate('/app');
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:5002/api/data/${student._id}`, {
          method: 'DELETE',
        });
        alert('Student deleted successfully.');
        navigate('/app');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student.');
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('score.')) {
      const [_, subject] = name.split('.');
      setEditableStudent((prev) => ({
        ...prev,
        score: {
          ...prev.score,
          [subject]: value,
        },
      }));
    } else {
      setEditableStudent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    console.log('Saving data:', editableStudent);
    try {
      const response = await fetch(`http://localhost:5002/api/data/${student._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableStudent),
      });

      if (response.ok) {
        alert('Student details updated successfully.');
        setIsEditing(false);
      } else {
        alert('Failed to update student details.');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student.');
    }
  };
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
          const response = await fetch('http://localhost:8000/predict-eligible-colleges/', { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                PROGRAM: 1,
                TUTION_FEE: parseInt(maxfee, 10), // Convert to integer
                SCHOLARSHIP_AVAL: 1,
                PROGRAM_DURATION: 4,
                COUNTRY: 1, // Example country code
                LIVING_COST: 15000,
                ALUMINI_NETWORK: 1,
                GATE_SCORE: parseInt(score.gatescore, 10),
                GRE_SCORE: parseInt(score.grescore, 10),
                TOEFL_SCORE: parseInt(score.toeflscore, 10),
                IELTS_SCORE: parseInt(score.ieltsscore, 10),
                GMAT_SCORE: parseInt(score.gmatscore, 10),
                SAT_SCORE: parseInt(score.satscore, 10),
                CGPA: cgpa,
                DEGREE: 1, // Example degree code
                MAJOR: 1,
                ACHIVEMENT: 1,
                PROJECTS: 2,
                N_PAPERS: 1,
            }),
          });
          const recommendationsData = await response.json();
          console.log("Recommendations Data:", recommendationsData);  // Log the data
          if (response.ok) {
              setRecommendations(recommendationsData.eligible_colleges);  // Ensure you're accessing the correct property
          } else {
              console.error('Failed to fetch recommendations');
          }
      } catch (error) {
          console.error('Error fetching recommendations:', error);
      }finally{
        setLoading(false);
      }
  };  
    fetchRecommendations();
}, [editableStudent]);


  if (!editableStudent) {
    return <div>No student data available.</div>;
  }

  return (
    <>
      <div className="header">
        <img src={image} alt="logo" />
      </div>
      <div className="title">
        <h2>Higher Studies Students Data</h2>
      </div>
      <div className="profile-container">
          <div className='profile-details-container'>
          <div className="profile-header">
            <h1>{isEditing ? (
              <input
                type="text"
                name="studentname"
                value={editableStudent.studentname}
                onChange={handleChange}
              />
            ) : (
              editableStudent.studentname
            )}</h1>
          </div>
          <div className="profile-details">
            {Object.keys(editableStudent).map((key) => (
              key !== 'score' && key !== '_id' && (
                <div key={key} className='detail-row'>
                  <div className="detail-label">{key}</div>
                  <div className="detail-data">
                    {isEditing ? (
                      <input
                        type="text"
                        name={key}
                        value={editableStudent[key]}
                        onChange={handleChange}
                      />
                    ) : (
                      editableStudent[key]
                    )}
                  </div>
                </div>
              )
            ))}
            <div className="score">
              <h3 className='score-heading'>score</h3>
              {Object.entries(editableStudent.score || {}).map(([subject, score]) => (
                <div key={subject} className='detail-row'>
                  <div className="detail-label">
                    {subject}
                  </div>
                  <div className='detail-data'>
                    {isEditing ? (
                      <input
                        type="text"
                        name={`score.${subject}`}
                        value={score}
                        onChange={handleChange}
                      />
                    ) : (
                      score
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='button'>
            <div>
              {isEditing ? (
                <button onClick={handleSave} className='save-button'>Save</button>
              ) : (
                <button onClick={handleEditToggle} className='edit-button'>Edit</button>
              )}
            </div>
            <div>
              <button onClick={handleReturn} className="return-button">Return to List</button>
            </div>
            <div>
              <button onClick={handleDelete} className='delete-button'>Delete</button>
            </div>
          </div>
        </div>
        <div className="recommendations-container">
          <div className="recommendations">
              <h3>Recommended Colleges</h3>
              {recommendations.length > 0 ? (
                  <ul>
                      {recommendations.map((college, index) => (
                          <li key={index}>
                              <h4>{college.college_name}</h4>
                              <p>Eligibility Percentage: {college.ELIGIBILITY_PERCENTAGE}</p>
                              <p>Financial Probablity: {college.financial_percentage}</p>
                              <p>Academic Probablity: {college.academic_percentage}</p>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <div className="no-recommendations">{loading ? (<p>Loading...</p>) : (<p>No recommendations available yet.</p>)}</div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
