import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dropdown from './components/dropdown.js';
import { Navigate } from 'react-router-dom';
import ProfilePage from './StudentProfile.js';
import './App.css';
import image from './Assets/logo.png';
import Loginpage from './LoginPage.js';
import Signup from './Signup.js';

function App() {
  const [searchQuery, setSearchQuery] = useState('')
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
  const [sortConfigs, setSortConfigs] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5002/api/data')
      .then((response) => {
        const fetchedData = response.data;
        setData(fetchedData);
        setFilteredData(fetchedData);

        const uniqueYears = [...new Set(fetchedData.map((item) => item.year))];
        const uniqueDepartments = [...new Set(fetchedData.map((item) => item.department))];
        const uniqueSections = [...new Set(fetchedData.map((item) => item.section))];
        const uniqueGenders = [...new Set(fetchedData.map((item) => item.gender))];
        const uniqueCountries = [...new Set(fetchedData.map((item) => item.preferredcountry))];
        const allScores = fetchedData.flatMap((item) => Object.keys(item.scores || {}));
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
    let filtered = data.filter((item) => {
      const scoreMatch = selectedScores.length === 0 || selectedScores.every((score) => item.scores?.[score]);
      const searchMatch =
      item.studentname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preferreddegree.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preferredcourse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preferredcountry.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        (!selectedYear || item.year === selectedYear) &&
        (!selectedDepartment || item.department === selectedDepartment) &&
        (!selectedSection || item.section === selectedSection) &&
        (!selectedGender || item.gender === selectedGender) &&
        (!selectedCountry || item.preferredcountry === selectedCountry) &&
        scoreMatch && searchMatch
      );
    });

    if (sortConfigs.length > 0) {
      filtered = filtered.sort((a, b) => {
        for (const config of sortConfigs) {
          const aScore = a.scores?.[config.key] || 0;
          const bScore = b.scores?.[config.key] || 0;

          if (aScore < bScore) {
            return config.direction === 'ascending' ? -1 : 1;
          }
          if (aScore > bScore) {
            return config.direction === 'ascending' ? 1 : -1;
          }
        }
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [
    selectedYear,
    selectedDepartment,
    selectedSection,
    selectedGender,
    selectedCountry,
    selectedScores,
    sortConfigs,
    data, searchQuery
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
          setSelectedScores(selectedScores.filter((score) => score !== selected));
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

  const requestSort = (key) => {
    let newSortConfigs = [...sortConfigs];
    const existingConfigIndex = newSortConfigs.findIndex((config) => config.key === key);

    if (existingConfigIndex >= 0) {
      if (newSortConfigs[existingConfigIndex].direction === 'ascending') {
        newSortConfigs[existingConfigIndex].direction = 'descending';
      } else {
        newSortConfigs.splice(existingConfigIndex, 1);
      }
    } else {
      newSortConfigs.push({ key, direction: 'ascending' });
    }

    setSortConfigs(newSortConfigs);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDropdownStyle = (type) => {
    return getDropdownTitle(type) !== type ? { backgroundColor: '#fff35e' } : {};
  };

  const toggleDropdown = (type) => {
    if (openDropdown === type) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(type);
    }
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
    setOpenDropdown(null);
  };

  const handleRowClick = (student) => {
    navigate('/profile', { state: { student } });
  };

  return (
    <Routes>
      <Route path="/" element={<Loginpage />} />
      <Route path="/signup" element={<Signup />}/>
      <Route

        path="/app"
        element={
          <>
            <div className="header">
              <img src={image} alt="logo" />
            </div>
            <div className="title">
              <h2>Higher Studies Students Data</h2>
            </div>
            <div className="filter" ref={dropdownRef}>
              <div className="filterify">
                <h4>Filter list by: </h4>
                <div className="params">
                  <Dropdown
                    buttonField={getDropdownTitle('Year')}
                    items={dropdownData.years}
                    isOpen={openDropdown === 'Year'}
                    toggleDropdown={() => toggleDropdown('Year')}
                    onSelect={(selected) => handleSelect('Year', selected)}
                    resetDropdown={() => resetDropdown('Year')}
                    dropdownClass={getDropdownClass('Year')}
                    style={getDropdownStyle('Year')}
                  />
                  <Dropdown
                    buttonField={getDropdownTitle('Department')}
                    items={dropdownData.departments}
                    isOpen={openDropdown === 'Department'}
                    toggleDropdown={() => toggleDropdown('Department')}
                    onSelect={(selected) => handleSelect('Department', selected)}
                    resetDropdown={() => resetDropdown('Department')}
                    dropdownClass={getDropdownClass('Department')}
                    style={getDropdownStyle('Department')}
                  />
                  <Dropdown
                    buttonField={getDropdownTitle('Section')}
                    items={dropdownData.sections}
                    isOpen={openDropdown === 'Section'}
                    toggleDropdown={() => toggleDropdown('Section')}
                    onSelect={(selected) => handleSelect('Section', selected)}
                    resetDropdown={() => resetDropdown('Section')}
                    dropdownClass={getDropdownClass('Section')}
                    style={getDropdownStyle('Section')}
                  />
                  <Dropdown
                    buttonField={getDropdownTitle('Gender')}
                    items={dropdownData.genders}
                    isOpen={openDropdown === 'Gender'}
                    toggleDropdown={() => toggleDropdown('Gender')}
                    onSelect={(selected) => handleSelect('Gender', selected)}
                    resetDropdown={() => resetDropdown('Gender')}
                    dropdownClass={getDropdownClass('Gender')}
                    style={getDropdownStyle('Gender')}
                  />
                  <Dropdown
                    buttonField={getDropdownTitle('Preferred Country')}
                    items={dropdownData.countries}
                    isOpen={openDropdown === 'Preferred Country'}
                    toggleDropdown={() => toggleDropdown('Preferred Country')}
                    onSelect={(selected) => handleSelect('Preferred Country', selected)}
                    resetDropdown={() => resetDropdown('Preferred Country')}
                    dropdownClass={getDropdownClass('Preferred Country')}
                    style={getDropdownStyle('Preferred Country')}
                  />
                  <Dropdown
                    buttonField={getDropdownTitle('Scores')}
                    items={dropdownData.scores}
                    isOpen={openDropdown === 'Scores'}
                    toggleDropdown={() => toggleDropdown('Scores')}
                    onSelect={(selected) => handleSelect('Scores', selected)}
                    resetDropdown={() => resetDropdown('Scores')}
                    dropdownClass={getDropdownClass('Scores')}
                    style={getDropdownStyle('Scores')}
                  />
                </div>
              </div>
              <div className='button-container'>
          <button className='glow-button'>Chat with Kutty AI</button>
        </div>
        
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search name, id, Department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="table-container">
              <div className="table-header">
              <span onClick={() => requestSort('studentname')}>
                  S.no
                </span>
                <span onClick={() => requestSort('studentname')}>
                  Name
                </span>
                <span onClick={() => requestSort('studentid')}>
                  ID
                </span>
                <span  onClick={() => requestSort('department')}>
                  Department
                </span>
                <span onClick={() => requestSort('section')}>
                  Section
                </span>
                <span  onClick={() => requestSort('preferreddegree')}>
                  Preferred Degree
                </span>
                <span onClick={() => requestSort('preferredcourse')}>
                  Preferred Course
                </span>
                <span  onClick={() => requestSort('preferredcountry')}>
                  Preferred Country
                </span>
                {selectedScores.map((score) => (
                  <span key={score} className="sortable-header" onClick={() => requestSort(score)}>
                    {score}
                  </span>
                ))}
              </div>
              <div className="scrollable-list">
                {filteredData.map((item, index) => (
                  <div
                    className="list-item"
                    key={item._id}
                    onClick={() => handleRowClick(item)}
                  >
                    <span className='student-name'>{index + 1}</span>
                    <span className='student-name'>{item.studentname}</span>
                    <span className='student-name'>{item.studentid}</span>
                    <span>{item.department}</span>
                    <span>{item.section}</span>
                    <span>{item.preferreddegree}</span>
                    <span>{item.preferredcourse}</span>
                    <span>{item.preferredcountry}</span>
                    {selectedScores.map((score) => (
                      <span key={score}>{item.scores?.[score] || '-'}</span>
                    ))}
                  </div>
                ))}
              </div>

            </div>
            <div className='footer'>
        <h4>Broadcast Message</h4>
        <p>Send a broadcast message to all filtered students instantly.</p>
        <div className='button-container'>
            <button className='glow-button'>Send Broadcast Message</button>
        </div>
      </div>
          </>
        }
      />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;