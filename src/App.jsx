import './App.css';
import { useCallback, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Spinner } from "@chakra-ui/react";
import SearchBar from './components/SearchBar/SearchBar.jsx';
import BusDataContainer from './components/BusDataContainer/BusDataContainer.jsx';
import Favourites from './components/Favourites/Favourites.jsx';
import { SearchTermProvider, SearchTermContext } from './contexts/SearchTermContext';
import { Link } from 'react-router-dom';
import { BsBusFront } from "react-icons/bs";
import { Button } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";

function Header() {
  const {setSearchTerm} = useContext(SearchTermContext);

  return (
    <header className="App-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link to="/" onClick={() => setSearchTerm('')}>
          <BsBusFront size={30} />
        </Link>
        <h1>Bus Arrival App Using LTA's API</h1>
      </div>
      <Link to="/favourites">
        <Button><FaHeart size='1.4em' color='#ef6648' /></Button>
      </Link>
    </header>
  );
}

function Homepage() {
  const { searchTerm, fetchBusData, busData, isLoading, error } = useContext(SearchTermContext);

  return (
    <div className="centered-horizontal BusDataContainer">
      <SearchBar fetchBusData={fetchBusData} />
      {error && <div>{error}</div>}
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="lg"
        />
      ) : (
        <BusDataContainer key={searchTerm} busData={busData} fetchBusData={fetchBusData} />
      )}
    </div>
  );
}

function App() {
  return (
    <div className="centered-horizontal">
      <Router>
        <SearchTermProvider>
          <Header />
          <Switch>
            <Route path="/" exact component={Homepage} />
            <Route path="/favourites" exact component={Favourites} />
          </Switch>
        </SearchTermProvider>
      </Router>
    </div>
  );
}

export default App;