import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const SearchTermContext = createContext();

export const SearchTermProvider = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const initialSearchTerm = new URLSearchParams(location.search).get('BusStopCode') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [busData, setBusData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevLocation = useRef(location);

  const fetchBusData = useCallback(async (term) => {
    if (!term) {
      setBusData(null);
      return;
    }
  
    setIsLoading(true);
    setBusData(null);
    
    try {
      const response = await fetch(
        `https://bus-arrival-app-using-ltas-api-server.onrender.com/api/BusArrivalv2?BusStopCode=${term}`
      );
    
      const jsonData = await response.json();
      setBusData(jsonData);
    } catch (error) {
      setError('Error fetching bus data');
      console.error('Error fetching bus data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('searchTerm:', searchTerm);
    if (searchTerm) {
      fetchBusData(searchTerm);
    } else {
      setBusData(null);
    }
  }, [searchTerm, fetchBusData]);

  useEffect(() => {
    if (prevLocation.current.pathname === location.pathname && prevLocation.current.search === location.search) {
      return;
    }
  
    prevLocation.current = location;
  
    const queryParams = new URLSearchParams(location.search);
    const currentBusStopCode = queryParams.get('BusStopCode');
  
    if (searchTerm === '' && currentBusStopCode && location.pathname !== '/favourites') {
      history.push('/');
    } else if (searchTerm !== '' && searchTerm !== currentBusStopCode) {
      if (location.pathname === '/favourites' || location.pathname === '/') {
        queryParams.delete('BusStopCode');
      } else {
        queryParams.set('BusStopCode', searchTerm);
      }
      history.replace({
        pathname: location.pathname,
        search: queryParams.toString()
      });
    }
  }, [history, location, prevLocation, searchTerm]);

  return (
    <SearchTermContext.Provider value={{ searchTerm, setSearchTerm, fetchBusData, busData, setBusData, isLoading, setIsLoading, error, setError }}>
      {children}
    </SearchTermContext.Provider>
  );
};