'use client';
import { Button, Card } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Dog } from './page';
interface DogDisplayProps {
  dogs: Dog[];
}

const DogDisplay: React.FC<DogDisplayProps> = ({ dogs }) => {
  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-3 '>
      {dogs.map((dog: Dog) => (
        <Card className=' max-w-sm m-10 ' key={dog.id}>
          <div className='flex m-2 justify-center'>
            <h1 className='font-bold text-center text-2xl'>{dog.name}</h1>
          </div>
          <img
            className='w-full h-48 object-cover rounded'
            src={dog.img}
            alt={dog.name}
          />
          <div className='flex flex-row p-3'>
            <div className='flex flex-col w-1/2'>
              <label>{dog.breed}</label>
              <label>{dog.age} years old</label>
              <label>{dog.zip_code}</label>
            </div>
            <div className='w-1/2 flex justify-center items-center '>
              <Button>Adopt</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DogDisplay;
