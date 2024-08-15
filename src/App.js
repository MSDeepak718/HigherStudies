import image from './Assets/logo.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dropdown from './components/dropdown';
import './App.css';

function App() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedScores, setSelectedScores] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    years: [],
    departments: [],
    sections: [],
    genders: [],
    countries: [],
    scores: [],
  });

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const resetDropdown = (type) => {
    switch (type) {
      case 'Year':
        setSelectedYear('');
        break;
      case 'Department':
        setSelectedDepartment('');
        break;
      case 'Section':
        setSelectedSection('');
        break;
      case 'Gender':
        setSelectedGender('');
        break;
      case 'Preferred Country':
        setSelectedCountry('');
        break;
      case 'Scores':
        setSelectedScores([]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/data')
      .then((response) => {
        const fetchedData = response.data;
        setData(fetchedData);
        setFilteredData(fetchedData);

        const uniqueYears = [...new Set(fetchedData.map(item => item.year))];
        const uniqueDepartments = [...new Set(fetchedData.map(item => item.department))];
        const uniqueSections = [...new Set(fetchedData.map(item => item.section))];
        const uniqueGenders = [...new Set(fetchedData.map(item => item.gender))];
        const uniqueCountries = [...new Set(fetchedData.map(item => item.preferredcountry))];
        const allScores = fetchedData.flatMap(item => Object.keys(item.scores || {}));
        const uniqueScores = [...new Set(allScores)];

        setDropdownData({
          years: uniqueYears,
          departments: uniqueDepartments,
          sections: uniqueSections,
          genders: uniqueGenders,
          countries: uniqueCountries,
          scores: uniqueScores,
        });
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const scoreMatch = selectedScores.length === 0 || selectedScores.every(score => item.scores?.[score]);
      return (
        (!selectedYear || item.year === selectedYear) &&
        (!selectedDepartment || item.department === selectedDepartment) &&
        (!selectedSection || item.section === selectedSection) &&
        (!selectedGender || item.gender === selectedGender) &&
        (!selectedCountry || item.preferredcountry === selectedCountry) &&
        scoreMatch
      );
    });
    setFilteredData(filtered);
  }, [
    selectedYear,
    selectedDepartment,
    selectedSection,
    selectedGender,
    selectedCountry,
    selectedScores,
    data,
  ]);

  const handleSelect = (type, selected) => {
    switch (type) {
      case 'Year':
        setSelectedYear(selectedYear === selected ? '' : selected);
        break;
      case 'Department':
        setSelectedDepartment(selectedDepartment === selected ? '' : selected);
        break;
      case 'Section':
        setSelectedSection(selectedSection === selected ? '' : selected);
        break;
      case 'Gender':
        setSelectedGender(selectedGender === selected ? '' : selected);
        break;
      case 'Preferred Country':
        setSelectedCountry(selectedCountry === selected ? '' : selected);
        break;
      case 'Scores':
        if (selectedScores.includes(selected)) {
          setSelectedScores(selectedScores.filter(score => score !== selected));
        } else {
          setSelectedScores([...selectedScores, selected]);
        }
        break;
      default:
        break;
    }
    toggleDropdown(type);
  };

  const getDropdownTitle = (type) => {
    switch (type) {
      case 'Year':
        return selectedYear || 'Year';
      case 'Department':
        return selectedDepartment || 'Department';
      case 'Section':
        return selectedSection || 'Section';
      case 'Gender':
        return selectedGender || 'Gender';
      case 'Preferred Country':
        return selectedCountry || 'Preferred Country';
      case 'Scores':
        return selectedScores.length > 0 ? selectedScores.join(', ') : 'Scores';
      default:
        return '';
    }
  };

  const getDropdownClass = (type) => {
    return getDropdownTitle(type) !== type ? 'highlighted-dropdown' : '';
  };

  return (
    <>
      <div className='header'>
        <img src={image} alt='logo' />
      </div>
      <div className='title'>
        <h2>Higher Studies Students Data</h2>
      </div>
      <div className='filter'>
        <div className='filterify'>
          <h4>Filter list by: </h4>
          <div className='params'>
            <Dropdown
              buttonField={getDropdownTitle('Year')}
              items={dropdownData.years}
              isOpen={openDropdown === 'Year'}
              toggleDropdown={() => toggleDropdown('Year')}
              onSelect={(selected) => handleSelect('Year', selected)}
              resetDropdown={() => resetDropdown('Year')}
              dropdownClass={getDropdownClass('Year')}
            />
            <Dropdown
              buttonField={getDropdownTitle('Department')}
              items={dropdownData.departments}
              isOpen={openDropdown === 'Department'}
              toggleDropdown={() => toggleDropdown('Department')}
              onSelect={(selected) => handleSelect('Department', selected)}
              resetDropdown={() => resetDropdown('Department')}
              dropdownClass={getDropdownClass('Department')}
            />
            <Dropdown
              buttonField={getDropdownTitle('Section')}
              items={dropdownData.sections}
              isOpen={openDropdown === 'Section'}
              toggleDropdown={() => toggleDropdown('Section')}
              onSelect={(selected) => handleSelect('Section', selected)}
              resetDropdown={() => resetDropdown('Section')}
              dropdownClass={getDropdownClass('Section')}
            />
            <Dropdown
              buttonField={getDropdownTitle('Gender')}
              items={dropdownData.genders}
              isOpen={openDropdown === 'Gender'}
              toggleDropdown={() => toggleDropdown('Gender')}
              onSelect={(selected) => handleSelect('Gender', selected)}
              resetDropdown={() => resetDropdown('Gender')}
              dropdownClass={getDropdownClass('Gender')}
            />
            <Dropdown
              buttonField={getDropdownTitle('Preferred Country')}
              items={dropdownData.countries}
              isOpen={openDropdown === 'Preferred Country'}
              toggleDropdown={() => toggleDropdown('Preferred Country')}
              onSelect={(selected) => handleSelect('Preferred Country', selected)}
              resetDropdown={() => resetDropdown('Preferred Country')}
              dropdownClass={getDropdownClass('Preferred Country')}
            />
            <Dropdown
              buttonField={getDropdownTitle('Scores')}
              items={dropdownData.scores}
              isOpen={openDropdown === 'Scores'}
              toggleDropdown={() => toggleDropdown('Scores')}
              onSelect={(selected) => handleSelect('Scores', selected)}
              resetDropdown={() => resetDropdown('Scores')}
              dropdownClass={getDropdownClass('Scores')}
            />
          </div>
        </div>
        <div className='button-container'>
          <button className='glow-button'>Chat with Kutty AI</button>
        </div>
      </div>
      <div className='table-container'>
        <div className='table-header'>
          <span>S.No</span>
          <span>Student Name</span>
          <span>Student Id</span>
          <span>Department</span>
          <span>Section</span>
          <span>Preferred Degree</span>
          <span>Preferred Course</span>
          <span>Preferred Country</span>
          {selectedScores.map(score => (
            <span key={score}>{score}</span>
          ))}
        </div>
        <div className='scrollable-list'>
          {filteredData.map((item, index) => (
            <div className='list-item' key={item._id}>
              <span>{index + 1}</span>
              <span>{item.studentname}</span>
              <span>{item.studentid}</span>
              <span>{item.department}</span>
              <span>{item.section}</span>
              <span>{item.preferreddegree}</span>
              <span>{item.preferredcourse}</span>
              <span>{item.preferredcountry}</span>
              {selectedScores.map(score => (
                <span key={score}>{item.scores?.[score] || 'N/A'}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='footer'>
        <p>This is a footer</p>
      </div>
    </>
  );
}

export default App;
