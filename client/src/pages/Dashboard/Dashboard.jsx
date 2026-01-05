import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Filter from '../../components/Filter/Filter';
import Header from '../../components/Header/Header';
import Search from '../../components/Search/Search';
import Table from '../../components/Table/Table';
import apiService from '../../services/apiService';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedscore, setSelectedscore] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    years: [],
    departments: [],
    sections: [],
    genders: [],
    countries: [],
    score: [],
  });
  const [sortConfigs, setSortConfigs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.fetchStudents()
      .then((fetchedData) => {
        setData(fetchedData);
        setFilteredData(fetchedData);

        const uniqueYears = [...new Set(fetchedData.map((item) => item.year))];
        const uniqueDepartments = [...new Set(fetchedData.map((item) => item.department))];
        const uniqueSections = [...new Set(fetchedData.map((item) => item.section))];
        const uniqueGenders = [...new Set(fetchedData.map((item) => item.gender))];
        const uniqueCountries = [...new Set(fetchedData.map((item) => item.preferredcountry))];
        const allscore = fetchedData.flatMap((item) => Object.keys(item.score || {}));
        const uniquescore = [...new Set(allscore)];

        setDropdownData({
          years: uniqueYears,
          departments: uniqueDepartments,
          sections: uniqueSections,
          genders: uniqueGenders,
          countries: uniqueCountries,
          score: uniquescore,
        });
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    let filtered = data.filter((item) => {
      const scoreMatch = selectedscore.length === 0 || selectedscore.every((score) => item.score?.[score]);
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
          const ascore = a.score?.[config.key] || 0;
          const bscore = b.score?.[config.key] || 0;

          if (ascore < bscore) {
            return config.direction === 'ascending' ? -1 : 1;
          }
          if (ascore > bscore) {
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
    selectedscore,
    sortConfigs,
    data,
    searchQuery
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
      case 'score':
        if (selectedscore.includes(selected)) {
          setSelectedscore(selectedscore.filter((score) => score !== selected));
        } else {
          setSelectedscore([...selectedscore, selected]);
        }
        break;
      default:
        break;
    }
    toggleDropdown(type);
  };

  const handleStartStreamlit = async () => {
    try {
      const result = await mlService.startStreamlit();
      if (result.success && result.data.url) {
        window.open(result.data.url, '_blank');
      } else {
        alert("Failed to start Streamlit: " + (result.data?.message || 'Unknown error'));
      }
    } catch (error) {
      alert("Error starting Streamlit: " + error.message);
    }
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
        return selectedscore.length > 0 ? selectedscore.join(', ') : 'Scores';
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDropdownStyle = (type) => {
    return getDropdownTitle(type) !== type ? { backgroundColor: '#fff35e' } : {};
  };

  const handleAddStudent = () => {
    navigate('/create');
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
      case 'score':
        setSelectedscore([]);
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
    <>
      <Header/>
      <div className="title">
        <h2>Higher Studies Students Data</h2>
      </div>
      <Filter
        dropdownData={dropdownData}
        openDropdown={openDropdown}
        selectedYear={selectedYear}
        selectedDepartment={selectedDepartment}
        selectedSection={selectedSection}
        selectedGender={selectedGender}
        selectedCountry={selectedCountry}
        selectedscore={selectedscore}
        handleSelect={handleSelect}
        toggleDropdown={toggleDropdown}
        resetDropdown={resetDropdown}
        getDropdownTitle={getDropdownTitle}
        getDropdownClass={getDropdownClass}
        getDropdownStyle={getDropdownStyle}
      />
      <div className='filter2'>
        <div className='add-student'>
          <button className='addstudent-button' onClick={handleAddStudent}>Add Student</button>
        </div>
        <div className='buttons'>
          <div className='button-container'>
            <button className='glow-button' onClick={handleStartStreamlit}>Chat with Morphea AI</button>
          </div>
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>
      <Table
        filteredData={filteredData}
        selectedscore={selectedscore}
        requestSort={requestSort}
        handleRowClick={handleRowClick}
      />
      <div className='footer'>
        <h4>Broadcast Message</h4>
        <p>Send a broadcast message to all filtered students instantly.</p>
        <div className='button-container'>
          <button className='glow'>Send Broadcast Message</button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
