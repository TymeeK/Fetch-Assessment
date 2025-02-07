'use client';
import { useEffect, useState } from 'react';

const DogList = () => {
  const [dogs, setDogs] = useState([]);
  useEffect(() => {
    fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
      method: 'GET',
    }).then(res => console.log(res));
  }, []);
  return <div></div>;
};

export default DogList;
