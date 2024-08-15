import React, { useState } from 'react';
import './StudentProfile.css';
import image from './assets/logo.png'; // Update this path as necessary
import studentPhoto from './assets/profliephoto.jpg'; // Ensure the image file is located here

function StudentProfile({ student, onUpdate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(student);

  const handleEditChange = (e) => {
    setEditedDetails({
      ...editedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    onUpdate(editedDetails); // Update parent state with new details
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDelete(student.id); // Pass the user's ID to the delete function
    }
  };

  return (
    <>
      <div className="header">
        <img src={image} alt="Logo" />
      </div>
      {isEditing ? (
        <div className="edit-container">
          <div className="edit-header">
            <h2>Edit Student Details</h2>
          </div>
          {Object.keys(student).map((key) => (
            <div className="form-row" key={key}>
              <label>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</label>
              <input
                type="text"
                name={key}
                value={editedDetails[key]}
                onChange={handleEditChange}
              />
            </div>
          ))}
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-header-content">
              <div className="profile-photo">
                <img src={studentPhoto} alt="Student" />
              </div>
              <h2>{student.name}'s Profile</h2>
            </div>
          </div>
          <div className="profile-details">
            <div className="detail-row">
              <div className="detail-label">Name:</div>
              <div className="detail-value">{student.name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Registration No:</div>
              <div className="detail-value">{student.registrationNo}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Department:</div>
              <div className="detail-value">{student.department}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Date of Birth:</div>
              <div className="detail-value">{student.dob}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Gender:</div>
              <div className="detail-value">{student.gender}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Email:</div>
              <div className="detail-value">{student.email}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">LeetCode Problems Solved:</div>
              <div className="detail-value">{student.leetCodeProblems}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">LeetCode Rating:</div>
              <div className="detail-value">{student.leetCodeRating}</div>
            </div>
          </div>
          {/* Conditional Expansion */}
          <div className={`expandable-details ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {isExpanded && (
              <>
                <div className="detail-row">
                  <div className="detail-label">Extra Curriculars:</div>
                  <div className="detail-value">{student.extraCurricular}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">GATE Score:</div>
                  <div className="detail-value">{student.gateScore}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">GRE Score:</div>
                  <div className="detail-value">{student.greScore}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">GMAT Score:</div>
                  <div className="detail-value">{student.gmatScore}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Preferred Country:</div>
                  <div className="detail-value">{student.preferredCountry}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Number of Research Papers:</div>
                  <div className="detail-value">{student.researchPapers}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Number of Projects:</div>
                  <div className="detail-value">{student.projects}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Internship:</div>
                  <div className="detail-value">{student.internship}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Skills:</div>
                  <div className="detail-value">{student.skills.join(', ')}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Languages Known:</div>
                  <div className="detail-value">{student.languagesKnown.join(', ')}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">CodeChef Rating:</div>
                  <div className="detail-value">{student.codeChefRating}</div>
                </div>
              </>
            )}
          </div>
          {/* Profile Buttons */}
          <div className="profile-buttons">
            <button
              className="expand-button"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentProfile;
