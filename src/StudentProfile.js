import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './StudentProfile.css'; // Make sure to style your profile page as needed
import image from './Assets/logo.png'
function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { student } = location.state || {};

  const handleReturn = () => {
    navigate('/');
  };

  if (!student) {
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
      
        <div className="profile-header">
          <h1>{student.studentname}</h1>
        </div>
        <div className="profile-details">
         <div className='detail-row'>
            <div className="detail-label">ID:</div>
            <div className="detail-data">{student.studentid}</div>
        </div>
        <div className='detail-row'> 
          <div className="detail-label">Department</div>
          <div className="detail-data">{student.department}</div>
        </div>
        <div className='detail-row'>
          <div className="detail-label">Section</div>
          <div className="detail-data">{student.section}</div>
        </div>
        <div className='detail-row'>
          <div className="detail-label">Preferred Degree</div>
          <div className="detail-data">{student.preferreddegree}</div>
        </div>
        <div className='detail-row'>
          <div className="detail-label">PreferredCourse</div>
          <div className="detail-data"> {student.preferredcourse}</div>
        </div>
        <div className='detail-row'>
          <div className="detail-label">Preferred Country</div>
          <div className="detail-data">{student.preferredcountry}</div>
          </div>  
          <div className="scores">
            <h3 className='score-heading'>Scores:</h3>
            {Object.entries(student.scores || {}).map(([subject, score]) => (
              <div className='detail-row'>
                <div className="detail-label">
                 <p key={subject}>{subject}:</p></div>
                <div className='detail-data'> 
                  <p>{score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      
      <button onClick={handleReturn} className="return-button">Return to List</button>
    </div>
    </>

  );
}

export default ProfilePage;
