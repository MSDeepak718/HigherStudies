function StudentTable({ filteredData, selectedscore, requestSort, handleRowClick }) {
  return (
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
        <span onClick={() => requestSort('department')}>
          Department
        </span>
        <span onClick={() => requestSort('section')}>
          Section
        </span>
        <span onClick={() => requestSort('preferreddegree')}>
          Preferred Degree
        </span>
        <span onClick={() => requestSort('preferredcourse')}>
          Preferred Course
        </span>
        <span onClick={() => requestSort('preferredcountry')}>
          Preferred Country
        </span>
        {selectedscore.map((score) => (
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
            {selectedscore.map((score) => (
              <span key={score}>{item.score?.[score] || '-'}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentTable;
