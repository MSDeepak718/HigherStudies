import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './StudentProfile.css'; // Make sure to style your profile page as needed
import image from './Assets/logo.png'
function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { student } = location.state || {};

  const handleReturn = () => {
    navigate('/app');
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
            <div className="detail-label">RegNo</div>
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
          <div className="detail-label">PreferredCourse</div>
          <div className="detail-data"> {student.preferredcourse}</div>
        </div>
        <div className='detail-row'>
          <div className="detail-label">Preferred Country</div>
          <div className="detail-data">{student.preferredcountry}</div>
          </div>  
        <div className='detail-row'>
          <div className="detail-label">Preferred Degree</div>
          <div className="detail-data">{student.preferreddegree}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">Email Id</div>
          <div className="detail-data">{student.emailid}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">CGPA</div>
          <div className="detail-data">{student.cgpa}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">ExtraCurricular</div>
          <div className="detail-data">{student.extracurricularinfo}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">Gender</div>
          <div className="detail-data">{student.gender}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">Age</div>
          <div className="detail-data">{student.age}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">No Of Projects</div>
          <div className="detail-data">{student.numberofprojects}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">No Of Researchpapers</div>
          <div className="detail-data">{student.numberofresearchpapers}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">Level Of Researchpapers</div>
          <div className="detail-data">{student.levelofresearchpapers}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">Competitions</div>
          <div className="detail-data">{student.competitions}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">Languages Known</div>
          <div className="detail-data">{student.languagesknown}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">OnlineCourses</div>
          <div className="detail-data">{student.onlinecourses}</div>
        </div>
        
        <div className='detail-row'>
          <div className="detail-label">Internship</div>
          <div className="detail-data">{student.internship}</div>
        </div>
          <div className="scores">
            <h3 className='score-heading'>Scores</h3>
            {Object.entries(student.scores || {}).map(([subject, score]) => (
              <div className='detail-row'>
                <div className="detail-label">
                 <p key={subject}>{subject}</p></div>
                <div className='detail-data'> 
                  <p>{score}</p>
                </div>
              </div>
            ))}
          </div>
          
      <div className='button'>
        <div >
          <button className='edit-button'>Edit</button>
        </div>
        <div >
          <button onClick={handleReturn} className="return-button">Return to List</button>
        </div>
        <div >
          <button className='delete-button'>Delete</button>
        </div>
      </div>
        </div>
    </div>
    </>

  );
}

export default ProfilePage;
