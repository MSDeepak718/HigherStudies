import image from './Assets/logo.png'
import { useState } from 'react';
import Dropdown from './components/dropdown.js';
import './App.css';

function App() {
  
  const dropdownData = {
    items: ['I','II','III','IV'],
    items2: [
      'Computer Science Engineering',
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

  const students = [
    { rank: 1, name: 'Deepak', id: '23AD029', department: 'AI&DS', section: 'A', score: 97.9, country: 'USA' },
    { rank: 2, name: 'Dicson Isaias', id: '23AD036', department: 'AI&DS', section: 'A', score: 96.5, country: 'Japan' },
    { rank: 3, name: 'Bhuvanesh', id: '23AD036', department: 'AI&DS', section: 'A', score: 85.5, country: 'Nigeria' },
    { rank: 4, name: 'Deepak Karthick', id: '23AD036', department: 'AI&DS', section: 'A', score: 89.5, country: 'Russia' },
    { rank: 5, name: 'Gokul', id: '23AD036', department: 'AI&DS', section: 'A', score: 90.5, country: 'German' },
    { rank: 6, name: 'Badri', id: '23AD036', department: 'AI&DS', section: 'A', score: 92.5, country: 'US' },
    { rank: 7, name: 'Akhilesh', id: '23AD036', department: 'AI&DS', section: 'A', score: 93.5, country: 'Japan' },
  ];
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (dropdown) => {
      setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return(
    <>
    <div className='header'>
      <img src={image} alt='logo'/>
    </div>
    <div className='title'>
      <h2>Higher Studies Students Data</h2>
    </div>
    <div className="filter">
      <div className='filterify'>
      <h4>Filter list by: </h4>
      <div className='params'><Dropdown 
          buttonField={'Year'} 
          items={dropdownData.items }
          isOpen={openDropdown==='Year'}
          toggleDropdown={()=>toggleDropdown('Year')}
        />
        <Dropdown 
          buttonField={'Department'} 
          items={dropdownData.items2}
          isOpen={openDropdown==='Department'}
          toggleDropdown={()=>toggleDropdown('Department')}
          
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
          <span>Rank</span>
          <span>Student Name</span>
          <span>Student Id</span>
          <span>Department</span>
          <span>Section</span>
          <span>Score</span>
          <span>Preferred Country</span>
        </div>
        <div className="scrollable-list">
          {students.map((student, index) => (
            <div className="list-item" key={index}>
              <span>{student.rank}</span>
              <span>{student.name}</span>
              <span>{student.id}</span>
              <span>{student.department}</span>
              <span>{student.section}</span>
              <span>{student.score}</span>
              <span>{student.country}</span>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

export default App;
