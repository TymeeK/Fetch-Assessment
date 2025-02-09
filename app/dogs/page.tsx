'use client';
import React from 'react';
import DogDisplay from './dogdisplay';
import DogFilter from './dogfilter';
import { ScrollShadow } from '@heroui/react';
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

const Dogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  return (
    <>
      <Nav />
      <ScrollShadow>
        <DogFilter setDogs={setDogs} />
      </ScrollShadow>

      <div>
        <DogDisplay dogs={dogs} />
      </div>
    </>
  );
};

export default Dogs;
