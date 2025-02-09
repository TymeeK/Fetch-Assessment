import React from 'react';
import DogList from './doglist';
import DogFilter from './dogfilter';
import { ScrollShadow } from '@heroui/react';
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
    <div>
      <ScrollShadow>
        <DogFilter setDogs={setDogs} />
      </ScrollShadow>
      <DogList />
    </div>
  );
};

export default Dogs;
