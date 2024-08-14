import './dropdown.css';

const Dropdown = ({buttonField,items,isOpen,toggleDropdown,onSelect})=>{

return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {buttonField}
        <span className={`arrow ${isOpen ? 'up' : 'down'}`} />
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li key={index} className="dropdown-item" onClick={()=>onSelect(item)}>
              <button>{item}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

