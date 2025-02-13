'use client';
import React from 'react';
import DogDisplay from './dogdisplay';
import DogFilter from './dogfilter';
import {
  Button,
  ScrollShadow,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  CircularProgress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
} from '@heroui/react';
import { useState } from 'react';
import Nav from '@/components/navbar';

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export const sortArrayByBreed = (dogs: Dog[]): Dog[] => {
  return dogs.sort((a, b) => a.breed.localeCompare(b.breed));
};

const Dogs: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favoriteDogId, setFavoriteDogId] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialFetch, setIntialFetch] = useState(false);
  const [dogMatch, setDogMatch] = useState<Dog | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDogFilter = (key: string) => {
    let sortedDogs: Dog[] = [...dogs];
    switch (key) {
      case 'asc':
        sortedDogs.sort((a, b) => a.breed.localeCompare(b.breed));
        break;
      case 'des':
        sortedDogs.sort((a, b) => b.breed.localeCompare(a.breed));
        break;
      case 'name-asc':
        sortedDogs.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-des':
        sortedDogs.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'age-yg':
        sortedDogs.sort((a, b) => a.age - b.age);
        break;
      case 'age-old':
        sortedDogs.sort((a, b) => b.age - a.age);
        break;
      default:
        return;
    }
    setDogs(sortedDogs);
  };

  const matchFavoriteDog = async () => {
    try {
      const response = await fetch(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(favoriteDogId),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { match } = await response.json();

      const matchResponse = await fetch(
        'https://frontend-take-home-service.fetch.com/dogs/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify([match]),
        }
      );
      const matchedDog = await matchResponse.json();
      console.log(matchedDog);
      setDogMatch(matchedDog[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const LoadingBar: React.FC = () => {
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <CircularProgress
          color='default'
          size='lg'
          label='Fetching doggos...'
        />
      </div>
    );
  };

  const InitialText: React.FC = () => {
    return (
      <div className='flex justify-center w-screen '>
        <h3 className='text-l font-bold text-gray-400 pt-20'>
          No dogs found. Press the filter button to search for dogs!
        </h3>
      </div>
    );
  };

  const adoptDog = () => {
    alert('Dog has been adopted!');
  };

  const DogMatchModal: React.FC = () => {
    return (
      <Modal placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='text-center font-bold text-2xl'>
                Match!
              </ModalHeader>
              <ModalBody>
                {dogMatch && (
                  <div className='flex flex-col'>
                    <h1 className='font-bold text-2xl'>{dogMatch.name}</h1>
                    <img src={dogMatch.img} alt={dogMatch.name} />
                    <label>Breed: {dogMatch.breed}</label>
                    <label>Zip code:{dogMatch.zip_code}</label>
                    <label>Age: {dogMatch.age}</label>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button
                  color='success'
                  variant='bordered'
                  onPress={() => adoptDog()}
                >
                  Adopt
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <>
      <Nav />
      <DogMatchModal />
      <ScrollShadow>
        <DogFilter
          setDogs={setDogs}
          setLoading={setLoading}
          setInitialFetch={setIntialFetch}
        />
      </ScrollShadow>
      {dogs.length > 0 && (
        <div className='flex justify-end mr-4'>
          <Dropdown>
            <DropdownTrigger>
              <Button variant='bordered'>Sort by</Button>
            </DropdownTrigger>
            <DropdownMenu onAction={key => handleDogFilter(String(key))}>
              <DropdownItem key='asc'>Breeds (ascending)</DropdownItem>
              <DropdownItem key='des'>Breeds (descending)</DropdownItem>
              <DropdownItem key='name-asc'>Name (ascending)</DropdownItem>
              <DropdownItem key='name-des'>Name (descending)</DropdownItem>
              <DropdownItem key='age-yg'>Age (youngest)</DropdownItem>
              <DropdownItem key='age-old'>Age (oldest)</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}

      {loading && initialFetch && dogs.length === 0 && <LoadingBar />}
      {!loading && dogs.length === 0 && !initialFetch && <InitialText />}

      {favoriteDogId && favoriteDogId.length > 0 && (
        <div className='flex justify-center w-screen'>
          <label>You have selected {favoriteDogId.length} favorite dogs</label>
          <Button
            onPress={() => {
              matchFavoriteDog();
              onOpen();
            }}
          >
            Match!
          </Button>
        </div>
      )}

      {!loading && dogs.length !== 0 && (
        <div className='flex justify-center w-screen'>
          <DogDisplay
            dogs={dogs}
            favoriteDogId={favoriteDogId}
            setFavoriteDogId={setFavoriteDogId}
          />
        </div>
      )}
    </>
  );
};

export default Dogs;
