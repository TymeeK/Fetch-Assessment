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

export const sortArrayByBreed = (dogs: Dog[]) => {
  return dogs.sort((a, b) => a.breed.localeCompare(b.breed));
};

const Dogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialFetch, setIntialFetch] = useState(false);

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
  return (
    <>
      <Nav />
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

      {loading && (
        <div className='flex justify-center items-center h-screen w-screen'>
          <CircularProgress
            color='default'
            size='lg'
            label='Fetching doggos...'
          />
        </div>
      )}
      {!loading && dogs.length === 0 && !initialFetch && (
        <div className='flex justify-center w-screen '>
          <h3 className='text-l font-bold text-gray-400 pt-20'>
            No dogs found. Press the filter button to search for dogs!
          </h3>
        </div>
      )}

      {!loading && dogs.length !== 0 && (
        <div className='flex justify-center w-screen'>
          <DogDisplay
            dogs={dogs}
            favoriteDogs={favoriteDogs}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      )}
    </>
  );
};

export default Dogs;
