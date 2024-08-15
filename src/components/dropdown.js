import './dropdown.css';

const Dropdown = ({ buttonField, items, isOpen, toggleDropdown, onSelect, resetDropdown, dropdownClass }) => {
  return (
    <div className={`dropdown ${dropdownClass}`}>
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {buttonField}
        <span className={`arrow ${isOpen ? 'up' : 'down'}`} />
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li className="dropdown-item">
            <button onClick={resetDropdown} className="reset-button">Default</button>
          </li>
          {items.map((item, index) => (
            <li key={index} className="dropdown-item" onClick={() => onSelect(item)}>
              <button>{item}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
