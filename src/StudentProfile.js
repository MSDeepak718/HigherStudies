import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './StudentProfile.css';
import image from './Assets/logo.png';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FFF35E', '#000066', '#4CAF50'];

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { student } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [editableStudent, setEditableStudent] = useState(student);
  const [isEditing, setIsEditing] = useState(false);

  const maxfee = student?.maxfee || 0;
  const cgpa = student?.cgpa || 0;
  const score = student?.score || {};

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
            TUTION_FEE: parseInt(maxfee, 10),
            SCHOLARSHIP_AVAL: 1,
            PROGRAM_DURATION: 4,
            COUNTRY: 1,
            LIVING_COST: 15000,
            ALUMINI_NETWORK: 1,
            GATE_SCORE: parseInt(score.gatescore, 10),
            GRE_SCORE: parseInt(score.grescore, 10),
            TOEFL_SCORE: parseInt(score.toeflscore, 10),
            IELTS_SCORE: parseInt(score.ieltsscore, 10),
            GMAT_SCORE: parseInt(score.gmatscore, 10),
            SAT_SCORE: parseInt(score.satscore, 10),
            CGPA: cgpa,
            DEGREE: 1,
            MAJOR: 1,
            ACHIVEMENT: 1,
            PROJECTS: 2,
            N_PAPERS: 1,
          }),
        });
        const recommendationsData = await response.json();
        if (response.ok) {
          setRecommendations(recommendationsData.eligible_colleges);
        } else {
          console.error('Failed to fetch recommendations');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
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
                  <div className="detail-label">{subject}</div>
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
            <button onClick={isEditing ? handleSave : handleEditToggle} className={isEditing ? 'save-button' : 'edit-button'}>
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button onClick={handleReturn} className="return-button">Return to List</button>
            <button onClick={handleDelete} className='delete-button'>Delete</button>
          </div>
        </div>
      <div className="recommendations-container">
        <div className="recommendations">
          <h3>Recommended Colleges</h3>
          {recommendations.length > 0 ? (
            recommendations.map((college, index) => (
              <div key={index} className="pie-chart-container">
                <h4>{college.COLLEGE_ID}</h4>
                <PieChart width={450} height={500}>
  <Pie
    data={[
      { name: 'Eligibility', value: parseFloat(college.ELIGIBILITY_PERCENTAGE.toFixed(2)) },
      { name: 'Financial', value: parseFloat(college.financial_percentage.toFixed(2)) },
      { name: 'Academic', value: parseFloat(college.academic_percentage.toFixed(2)) },
    ]}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={100}
    label={({ name, value }) => <span style={{ color: 'black', fontWeight: 'bold' }}>{`${name}: ${value}%`}</span>} // Custom label
    labelLine={true} 
  >
    {COLORS.map((color, i) => (
      <Cell
        key={`cell-${i}`}
        fill={color}
        style={{ cursor: 'pointer' }}
        onMouseEnter={(e) => e.target.setAttribute('fill-opacity', '0.7')}
        onMouseLeave={(e) => e.target.setAttribute('fill-opacity', '1')}
      />
    ))}
  </Pie>
  <Tooltip />
  <Legend
    wrapperStyle={{ color: 'black' }} // Set legend color
    formatter={(value) => <span style={{ color: 'black' }}>{value}</span>} // Custom legend item style
  />
</PieChart>
<hr />

              </div>
            ))
          ) : (
            <div className="no-recommendations">
              {loading ? <p>Loading...</p> : <p>No recommendations available yet.</p>}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default ProfilePage;
