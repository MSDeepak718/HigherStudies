import React, { useState } from "react";
import axios from "axios"; // You can use axios or fetch for making HTTP requests
import image from './Assets/logo.png'
import './InsertPage.css'

function InsertPage() {
  const [editableStudent, setEditableStudent] = useState({
    studentid: "",
    studentname: "",
    year: "",
    department: "",
    section: "",
    gender: "",
    emailid: "",
    arrearstatus: "",
    preferreddegree: "",
    preferredcourse: "",
    preferredcountry: "",
    scores: {
        gatescore: "",
        ieltsscore: "",
        grescore: ""
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("scores.")) {
      const subject = name.split(".")[1];
      setEditableStudent((prevState) => ({
        ...prevState,
        scores: {
          ...prevState.scores,
          [subject]: value,
        },
      }));
    } else {
      setEditableStudent((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {

    console.log("Submitting student:", editableStudent);
    try {
        const response = await axios.post("http://localhost:5002/api/data", editableStudent);
      if (response.status === 201) {
        alert("Student added successfully!");
        // Optionally, reset the form
        setEditableStudent({
        studentid:"",
          studentname: "",
          year: "",
          department: "",
          section: "",
          gender: "",
          emailid: "",
          arrearstatus: "",
          preferreddegree: "",
          preferredcourse: "",
          preferredcountry: "",
          scores: {
            gatescore: "",
            ieltsscore: "",
            grescore: ""
          },
        });
      }
    } catch (error) {
      console.error("There was an error adding the student!", error);
      alert("Failed to add student.");
    }
  };

  return (
    <>
      <div className="header">
        <img src={image} alt="logo" />
      </div>
      <div className="title">
        <h2>Add Students Interested in Higher Studies</h2>
      </div>
      <div className="form-container">
        <div className="input-field student-name">
          <h1>
            <input
              type="text"
              name="studentname"
              value={editableStudent.studentname}
              onChange={handleChange}
              placeholder="Student Name"
            />
          </h1>
        </div>
        <div className="input-fields-container">
          {Object.keys(editableStudent).map(
            (key) =>
              key !== "scores" && key !== "_id" && (
                <div key={key} className="input-field">
                  <label className="field-label">{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={editableStudent[key]}
                    onChange={handleChange}
                    placeholder={`Enter ${key}`}
                    className="input-box"
                  />
                </div>
              )
          )}
        </div>

        <div className="scores-section">
          <h3 className="scores-title">Scores</h3>
          {Object.entries(editableStudent.scores || {}).map(
            ([subject, score]) => (
              <div key={subject} className="input-field">
                <label className="field-label">{subject}</label>
                <input
                  type="text"
                  name={`scores.${subject}`}
                  value={score}
                  onChange={handleChange}
                  placeholder={`Enter score for ${subject}`}
                  className="input-box"
                />
              </div>
            )
          )}
        </div>

        <div className="submit-button-container">
          <button className="submit-button" onClick={handleSubmit}>
            Add Student
          </button>
        </div>
      </div>
    </>
  );
}

export default InsertPage;
