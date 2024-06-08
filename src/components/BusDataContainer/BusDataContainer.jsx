import BusCard from '../BusCard/BusCard.jsx';
import busStopData from '../../data/BusStopData.json';
import axios from 'axios';
import { Box, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { FaRegHeart } from "react-icons/fa";
import './BusDataContainer.css';

function BusDataContainer({ busData, fetchBusData }) {
  if (!busData) {
    return <div></div>;
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  const busStop = busStopData.value.find(busStop => busStop.BusStopCode === busData.BusStopCode);

  const addToFavourites = async () => {
    const url = 'https://api.airtable.com/v0/apptpfN3Y7IgW62Q8/favourites';
    const data = {
      fields: {
        "BusStopCode": Number(busData.BusStopCode),
        "Nickname": "My Favourite Bus Stop"
      }
    };
    const config = {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.post(url, data, config);
      console.log(response.data);
      onOpen();
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  return (
    <div className="container">
      <Box>
          <div className="container-header">
          <h2><b>{busData.BusStopCode}</b> {busStop ? busStop.Description : 'Unknown'}</h2>
            <div className='icons'>
            <IconButton
              aria-label="Add to favourites"
              icon={<FaRegHeart size="21px" color="#264653" />}
              onClick={addToFavourites}
              mr={1}
              style={{ background: 'transparent', padding: '0', margin: '0' }}
            />
            <IconButton
              aria-label="Refresh timings"
              icon={<RepeatIcon boxSize="24px" color="#264653" />}
              onClick={() => fetchBusData(busData.BusStopCode)}
              style={{ background: 'transparent', padding: '0', margin: '0' }}
              />
            </div>
        </div>
        {busData.Services.map((bus, index) => (
        <BusCard key={index} bus={bus} />
        ))}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bus Stop Added</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Bus stop {busData.BusStopCode} has been added to your favourites.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </div>
  );
}

export default BusDataContainer;