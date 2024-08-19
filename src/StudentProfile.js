import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './StudentProfile.css';
import image from './Assets/logo.png';

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { student } = location.state || {};

  const [editableStudent, setEditableStudent] = useState(student);
  const [isEditing, setIsEditing] = useState(false);

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
    setEditableStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log('Saving data:', editableStudent); // Debugging line
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
            key !== 'scores' && key !== '_id' && (
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
          <div className="scores">
            <h3 className='score-heading'>Scores</h3>
            {Object.entries(editableStudent.scores || {}).map(([subject, score]) => (
              <div key={subject} className='detail-row'>
                <div className="detail-label">
                  {subject}
                </div>
                <div className='detail-data'>
                  {isEditing ? (
                    <input
                      type="text"
                      name={`scores.${subject}`}
                      value={score}
                      onChange={(e) => handleChange({
                        target: {
                          name: `scores.${subject}`,
                          value: e.target.value,
                        },
                      })}
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
    </>
  );
}

export default ProfilePage;
