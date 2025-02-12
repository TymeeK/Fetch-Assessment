'use client';
import { Button, Card, Pagination } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Dog } from './page';
interface DogDisplayProps {
  dogs: Dog[];
  favoriteDogs: Dog[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DogDisplay: React.FC<DogDisplayProps> = ({
  dogs,
  favoriteDogs,
  loading,
  setLoading,
}) => {
  const dogsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastDog = currentPage * dogsPerPage;
  const indexOfFirstDog = indexOfLastDog - dogsPerPage;
  const currentDogs = dogs.slice(indexOfFirstDog, indexOfLastDog);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const favoriteDog = async (dog: Dog) => {
    const response = await fetch(
      'https://frontend-take-home-service.fetch.com/dogs/match',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(favoriteDogs),
      }
    );
    const json = await response.json();
  };

  // if (dogs.length === 0) {
  //   return (
  //     <div className='flex justify-center w-screen '>
  //       <h3 className='text-l font-bold text-gray-400 pt-20'>
  //         No dogs found. Press the filter button to search for dogs!
  //       </h3>
  //     </div>
  //   );
  // }

  return (
    <>
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
              <div className='flex flex-col  w-1/2'>
                <label>{dog.breed}</label>
                <label>{dog.age} years old</label>
                <label>Zip code: {dog.zip_code}</label>
              </div>
              <div className='w-1/2 flex justify-end items-center '>
                <Button
                  color='primary'
                  variant='ghost'
                  onPress={() => favoriteDog(dog)}
                >
                  Favorite
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
    </>
  );
};

export default DogDisplay;
