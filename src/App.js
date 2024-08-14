import image from './Assets/logo.png'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dropdown from './components/dropdown.js';
import './App.css';

function App() {
  
  const dropdownData = {
    items: ['I','II','III','IV'],
    items2: [
      'Computer Science',
      'Artificial Intelligence and Data Science',
      'Electronics and Communication Engineering',
      'Information Technology',
      'Computer Science Engineering(AIML)',
      'Computer Science and Business Systems',
      'Electronics and Electrical Engineering',
      'Mechanical Engineering',
      'Biomedical Engineering',
      'Civil Engineering'
    ],
    items3: ['A','B','C'],
    items4: ['Male','Female'],
    items5: ['United States of America',
      'United States',
      'Australia',
      'Germany',
      'Japan',
      'Italy',
      'Netherlands',
      'Canada',
      'France',
      'Malaysia',
      'Singapore'
    ]
  };

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const toggleDropdown = (dropdown) => {
      setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/data', {
      params: { department: selectedDepartment }
    })
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.error('There was an error fetching the data!', error);
    });
  }, [selectedDepartment]);


  return (
    <>
      <div className='header'>
        <img src={image} alt='logo' />
      </div>
      <div className='title'>
        <h2>Higher Studies Students Data</h2>
      </div>
      <div className="filter">
        <div className='filterify'>
          <h4>Filter list by: </h4>
          <div className='params'>
            <Dropdown 
              buttonField={'Year'} 
              items={dropdownData.items }
              isOpen={openDropdown==='Year'}
              toggleDropdown={()=>toggleDropdown('Year')}
            />
            <Dropdown 
            buttonField={'Department'} 
            items={dropdownData.items2}
            isOpen={openDropdown === 'Department'}
            toggleDropdown={() => toggleDropdown('Department')}
            onSelect={(selected) => {
              setSelectedDepartment(selected);
              toggleDropdown('Department');
            }}
          />
            <Dropdown 
              buttonField={'Section'} 
              items={dropdownData.items3}
              isOpen={openDropdown==='Section'}
              toggleDropdown={()=>toggleDropdown('Section')}
            />
            <Dropdown 
              buttonField={'Gender'} 
              items={dropdownData.items4}
              isOpen={openDropdown==='Gender'}
              toggleDropdown={()=>toggleDropdown('Gender')}
            />
            <Dropdown 
              buttonField={'Preferred Country'} 
              items={dropdownData.items5}
              isOpen={openDropdown==='Preferred Country'}
              toggleDropdown={()=>toggleDropdown('Preferred Country')}
            />
          </div>
        </div>
        <div>
          <button  className='chatbot-button'>Chat with Kutty AI</button>
        </div>
      </div>
      <div className="table-container">
        <div className="table-header">
          <span>S.No</span>
          <span>Student Name</span>
          <span>Student Id</span>
          <span>Department</span>
          <span>Section</span>
          <span>Preferred Degree</span>
          <span>Preferred Course</span>
          <span>Preferred Country</span>
        </div>
        <div className="scrollable-list">
          {data.map((item, index) => (
            <div className="list-item" key={item._id}>
              <span>{index + 1}</span>
              <span>{item.Studentname}</span>
              <span>{item.studentid}</span>
              <span>{item.department}</span>
              <span>{item.section}</span>
              <span>{item.preferreddegree}</span>
              <span>{item.preferredcourse}</span>
              <span>{item.preferredcountry}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
