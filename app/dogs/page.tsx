'use client';
import React from 'react';
import DogFilter from './dogfilter';
import { useState } from 'react';

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

const Dogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  return (
    <div className='flex'>
      <div className='w-1/4'>
        <h1>Dogs</h1>
        <DogFilter setDogs={setDogs} />
      </div>
      <div>
        {dogs.map(dog => (
          <div key={dog.id}>{dog.name}</div>
        ))}
      </div>
    </div>
  );
};

export default Dogs;
