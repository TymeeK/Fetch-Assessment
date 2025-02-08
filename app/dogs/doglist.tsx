'use client';
import {
  Button,
  Card,
  Checkbox,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';

const DogList = () => {
  const [dogBreeds, setDogBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState(new Set());

  const [ageMin, setAgeMin] = useState(0);
  const [ageMax, setAgeMax] = useState(0);

  useEffect(() => {
    fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setDogBreeds(data));
  }, []);

  if (dogBreeds.length === 0) {
    return <div>Loading...</div>;
  }

  const onButtonSearch = async () => {
    const response = await fetch(
      `https://frontend-take-home-service.fetch.com/dogs/search?ageMin=10`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    const json = await response.json();
    console.log(json.resultIds);
  };

  return (
    <div>
      <h1>Find Dogs</h1>
      <div>
        <label>Age min</label>
        <Input onChange={e => setAgeMin(Number(e.target.value))} />
        <label>Age max</label>
        <Input onChange={e => setAgeMax(Number(e.target.value))} />
      </div>
      <Button onPress={onButtonSearch}>Search</Button>

      <div className='grid grid-cols2 md:grid-cols-4 gap-4'>
        {dogBreeds.map(breed => (
          <Card
            className='p-4 cursor-pointer rounded-lg border ${selectedBreeds.has(breed) ? "bg-foreground text-background" : ""}'
            key={breed}
          >
            <div className='flex'>
              <Checkbox
                checked={selectedBreeds.has(breed)}
                onChange={() => {
                  if (selectedBreeds.has(breed)) {
                    setSelectedBreeds(new Set(selectedBreeds.values()));
                  } else {
                    setSelectedBreeds(new Set([...selectedBreeds, breed]));
                  }
                }}
              />
              {breed}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DogList;
