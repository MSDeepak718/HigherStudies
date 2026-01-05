import { useRef } from 'react';
import Dropdown from '../Dropdown/Dropdown';

function Filter({
  dropdownData,
  openDropdown,
  selectedYear,
  selectedDepartment,
  selectedSection,
  selectedGender,
  selectedCountry,
  selectedscore,
  handleSelect,
  toggleDropdown,
  resetDropdown,
  getDropdownTitle,
  getDropdownClass,
  getDropdownStyle
}) {
  const dropdownRef = useRef(null);

  return (
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
            items={dropdownData.score}
            isOpen={openDropdown === 'score'}
            toggleDropdown={() => toggleDropdown('score')}
            onSelect={(selected) => handleSelect('score', selected)}
            resetDropdown={() => resetDropdown('score')}
            dropdownClass={getDropdownClass('score')}
            style={getDropdownStyle('score')}
          />
        </div>
      </div>
    </div>
  );
}

export default Filter;
