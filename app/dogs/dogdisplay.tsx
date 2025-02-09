import { Card } from '@heroui/react';
import React from 'react';
import { Dog } from './page';

interface DogDisplayProps {
  dogs: Dog[];
}

const DogDisplay: React.FC<DogDisplayProps> = ({ dogs }) => {
  return (
    <div className='grid grid-cols-3'>
      {dogs.map((dog: Dog) => (
        <Card className='m-2' key={dog.id}>
          <h1>{dog.name}</h1>
          <h2>{dog.breed}</h2>
          <img src={dog.img} alt={dog.name} />
          <h3>{dog.age} years old</h3>
          <h3>{dog.zip_code}</h3>
        </Card>
      ))}
    </div>
  );
};

export default DogDisplay;
