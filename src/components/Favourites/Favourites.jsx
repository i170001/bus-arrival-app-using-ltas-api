import { useState, useEffect } from 'react';
import FavBusCard from '../FavBusCard/FavBusCard.jsx';

function Favourites() {
  const [records, setRecords] = useState([]);

  const deleteRecord = (id) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const fetchRecords = async () => {
    const response = await fetch('https://api.airtable.com/v0/apptpfN3Y7IgW62Q8/favourites', {
      headers: {
        'Authorization': 'Bearer patsD57VRN9C0UYIZ.aeb281474b41ced52688d5d4f183b5c2858349e6c91a9158f92425b886a0f392',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setRecords(data.records);
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      {records.map((record, index) => (
        <FavBusCard 
          key={index} 
          record={record} 
          onDelete={deleteRecord} 
          records={records} 
          setRecords={setRecords} />
      ))}
    </div>
  );
}

export default Favourites;