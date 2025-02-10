'use client';
import { Button, Card, Pagination } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Dog } from './page';
interface DogDisplayProps {
  dogs: Dog[];
}

const DogDisplay: React.FC<DogDisplayProps> = ({ dogs }) => {
  const dogsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastDog = currentPage * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = dogs.slice(indexOfFirstDog, indexOfLastDog);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-3 '>
      {currentDogs.map((dog: Dog) => (
        <Card className=' max-w-sm m-10 ' key={dog.id}>
          <div className='flex m-2 justify-center'>
            <h1 className='font-bold text-center text-2xl'>{dog.name}</h1>
          </div>
          <img
            className='w-full h-64 object-cover rounded'
            src={dog.img}
            alt={dog.name}
          />
          <div className='flex flex-row p-3'>
            <div className='flex justify-center items-center w-1/2'>
              <label>{dog.breed}</label>
            </div>
            <div className='w-1/2 flex justify-end items-center '>
              <Button color='primary' variant='ghost'>
                Adopt
              </Button>
            </div>
          </div>
        </Card>
      ))}
      <div className='flex justify-center w-screen mb-5 '>
        <Pagination
          total={Math.ceil(dogs.length / dogsPerPage)}
          initialPage={1}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default DogDisplay;
