'use client';
import React from 'react';
import DogFilter from './dogfilter';
import { useState } from 'react';
import DogDisplay from './dogdisplay';

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
        <DogDisplay dogs={dogs} />
      </div>
    </div>
  );
};

export default Dogs;
