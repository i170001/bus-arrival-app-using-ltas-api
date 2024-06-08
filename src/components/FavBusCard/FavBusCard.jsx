import axios from 'axios';
import busStopData from '../../data/BusStopData.json';
import './FavBusCard.css';
import { Link, useHistory } from 'react-router-dom';
import { useState, useRef, useContext } from 'react';
import { SearchTermContext } from '../../contexts/SearchTermContext';
import { 
  Button, 
  IconButton, 
  Input, 
  FormControl, 
  FormLabel,
  ButtonGroup, 
  Box, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  Spinner
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaPencilAlt } from "react-icons/fa";

function FavBusCard({ record, onDelete, records, setRecords }) {
  const [newNickname, setNewNickname] = useState(record.fields.Nickname);
  const { setSearchTerm } = useContext(SearchTermContext);
  const firstFieldRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  
  const busStopLookup = busStopData.value.reduce((lookup, busStop) => {
    lookup[busStop.BusStopCode] = busStop;
    return lookup;
  }, {});

  const busStop = busStopLookup[record.fields.BusStopCode];

  const deleteRecord = async () => {
    setIsLoading(true);
    const originalRecords = [...records]; // store a copy of the original records
    try {
      const url = `https://api.airtable.com/v0/apptpfN3Y7IgW62Q8/favourites/${record.id}`;
      const config = {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_APP_AIRTABLE_API_TOKEN}`
        }
      };
      await axios.delete(url, config);
      onDelete(record.id); // optimistically remove the record from the UI
      console.log("Record deleted successfully");
    } catch (error) {
      console.error('Error deleting record:', error);
      // revert the ui to its original state if the delete operation fails
      setRecords(originalRecords);
    } finally {
      setIsLoading(false);
    }
  };

  const editNickname = async () => {
    setIsLoading(true);
    // optimistically update the ui
    const originalNickname = record.fields.Nickname; // store the original nickname
    record.fields.Nickname = newNickname; // update the ui with the new nickname
    try {
      const url = `https://api.airtable.com/v0/apptpfN3Y7IgW62Q8/favourites/${record.id}`;
      const data = {
        "fields": {
          "Nickname": newNickname
        }
      };
      const config = {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_APP_AIRTABLE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.patch(url, data, config);
      console.log(response.data);
    } catch (error) {
      console.error('Error editing nickname:', error);
      // revert the ui to its original state if the edit operation fails
      record.fields.Nickname = originalNickname;
    }
    setIsLoading(false);
  };  
  
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  return (
    <div className="fav-bus-card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%', 
      backgroundColor: isLoading ? 'transparent' : '#E9C46A',
      boxShadow: isLoading ? 'none' : '0 2px 5px rgba(0, 0, 0, 0.15)'
    }}>
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="lg"
        />
      ) : (
        <>
          <header style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F4A261', padding: '5px 5px 5px 10px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Box as="h2" display='inline-block' mr={1.5}>
                {record.fields.Nickname}
              </Box>
              <IconButton size='1px' style={{ background: 'transparent', padding: '0', margin: '0', color: '#264653' }} icon={<FaPencilAlt />} onClick={onEditModalOpen} />
            </div>
            <span style={{ color: 'red', cursor: 'pointer', paddingRight: '5px', top: '-3px', position: 'relative', fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '100%'}} onClick={onDeleteModalOpen}>
              x
            </span>
          </header>
          <div
            onClick={() => setSearchTerm(record.fields.BusStopCode)}
            style={{ width: '100%', padding: '10px 10px 15px 10px' }}
          >
            <Link to="/">
              <p>Bus stop {record.fields.BusStopCode}</p>
              {busStop && <p>{busStop.Description}</p>}
            </Link>
          </div>

          <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} initialFocusRef={firstFieldRef}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Nickname</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel htmlFor='nickname'>Nickname</FormLabel>
                  <Input ref={firstFieldRef} id='nickname' defaultValue={record.fields.Nickname} onChange={e => setNewNickname(e.target.value)} />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <ButtonGroup display='flex' justifyContent='flex-end'>
                  <Button variant='outline' onClick={onEditModalClose}>Cancel</Button>
                  <Button colorScheme='teal' onClick={() => { editNickname(); onEditModalClose(); }}>Save</Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirmation</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to delete this record?
              </ModalBody>
              <ModalFooter>
                <ButtonGroup size='sm'>
                  <Button variant='outline' onClick={onDeleteModalClose}>Cancel</Button>
                  <Button colorScheme='red' onClick={() => { deleteRecord(); onDeleteModalClose(); }}>Delete</Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}
      
export default FavBusCard;