import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SearchTermContext } from '../../contexts/SearchTermContext';
import './SearchBar.css';

function SearchBar({ fetchBusData }) {
  const { searchTerm, setSearchTerm } = useContext(SearchTermContext);
  const [inputValue, setInputValue] = useState(searchTerm);
  const history = useHistory();
  
  useEffect(() => {
    const debounce = setTimeout(() => {
      const trimmedValue = String(inputValue).trim();
      if (trimmedValue !== searchTerm) {
        setSearchTerm(trimmedValue);
        if (trimmedValue === "") {
          history.push("/");
        } else {
          history.push(`/?BusStopCode=${trimmedValue}`);
        }
      }
    }, 1000);
  
    return () => {
      clearTimeout(debounce);
    };
  }, [inputValue, history, setSearchTerm, searchTerm]);

  function handleChange(evt) {
    const value = evt.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  return (
    <input
      className='search-bar'
      type="text"
      placeholder="Enter Bus Stop No."
      value={inputValue}
      onChange={handleChange}
    />
  );
};

export default SearchBar;