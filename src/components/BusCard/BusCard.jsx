import './BusCard.css';
import { FaWheelchair } from "react-icons/fa";
import { IoIosMan } from "react-icons/io";

function BusCard({ bus }) {
  const getMinutesUntilArrival = (arrivalTime) => {
    const arrivalDate = new Date(arrivalTime);
    const currentDate = new Date();
    const differenceInMilliseconds = arrivalDate - currentDate;
    const differenceInMinutes = Math.round(differenceInMilliseconds / 1000 / 60);
    return differenceInMinutes;
  };

  const getBusLoad = (load) => {
    let icons;
    switch (load) {
      case 'SEA':
        icons = [<IoIosMan key={1} size="1.0em" />];
        break;
      case 'SDA':
        icons = [<IoIosMan key={1} size="1.0em" />, <IoIosMan key={2} size="1.0em" />];
        break;
      case 'LSD':
        icons = [<IoIosMan key={1} size="1.0em" />, <IoIosMan key={2} size="1.0em" />, <IoIosMan key={3} size="2em" />];
        break;
      default:
        icons = [];
    }
  
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0', margin: '0' }}>
        {icons}
      </div>
    );
  };

  const getBusType = (type) => {
    switch (type) {
      case 'SD':
        return 'Single Deck';
      case 'DD':
        return 'Double Deck';
      case 'BD':
        return 'Bendy';
      default:
        return '';
    }
  };

  const getBusFeature = (feature) => {
    return feature === 'WAB' ? <FaWheelchair size="1.1em" style={{ marginLeft: '10px' }} /> : '';
  };

  return (
    <div className="bus-card">
      <div className="bus-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        Bus {bus.ServiceNo}
        {getBusFeature(bus.NextBus.Feature)}
      </h2>
        {/* <p>Type: {getBusType(bus.NextBus.Type)}</p> */}
        <p style={{ fontSize: '2em' }}>{getBusLoad(bus.NextBus.Load)}</p>
      </div>
      <div className="bus-timings" style={{ fontSize: '1.5em' }}>
        <p>
          {getMinutesUntilArrival(bus.NextBus.EstimatedArrival)}{', '}
          {getMinutesUntilArrival(bus.NextBus2.EstimatedArrival)}{', '}
          {getMinutesUntilArrival(bus.NextBus3.EstimatedArrival)} mins
        </p>
      </div>
    </div>
  );
}

export default BusCard;