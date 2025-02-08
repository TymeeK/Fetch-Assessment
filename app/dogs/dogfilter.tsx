'use client';
import { Button, Card, Checkbox, Input } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Dog } from './page';

export interface DogFilterProps {
  setDogs: (dogs: Dog[]) => void;
}

const DogFilter = ({ setDogs }: DogFilterProps) => {
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<Set<string>>(new Set());

  const [ageMin, setAgeMin] = useState<number>(0);
  const [ageMax, setAgeMax] = useState<number>(0);
  const [zipCode, setZipCode] = useState<number[]>([]);

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

  const returnFilteredResults = async (): Promise<string> => {
    const breedsArray: string[] = Array.from(selectedBreeds);

    const params: URLSearchParams = new URLSearchParams();
    if (breedsArray.length > 0) {
      breedsArray.forEach((breed: string) => {
        params.append('breeds', breed);
      });
    }
    if (zipCode.length > 0) {
      zipCode.forEach((zip: number) => {
        params.append('zipCodes', String(zip));
      });
    }
    if (ageMin > 0) {
      params.append('ageMin', String(ageMin));
    }
    if (ageMax > 0) {
      params.append('ageMax', String(ageMax));
    }
    console.log(params.toString());

    const response = await fetch(
      `https://frontend-take-home-service.fetch.com/dogs/search?${params}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    const json = await response.json();
    console.log(json, json.resultIds);
    return json.resultIds;
  };

  const onButtonSearch = async () => {
    const resultIds: string = await returnFilteredResults();
    console.log(resultIds);

    const response: Response = await fetch(
      'https://frontend-take-home-service.fetch.com/dogs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resultIds),
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(response);
    const json = await response.json();
    setDogs(json);
  };

  return (
    <div>
      <h2>Filter</h2>
      <div>
        <label>Age min</label>
        <Input onChange={e => setAgeMin(Number(e.target.value))} />
        <label>Age max</label>
        <Input onChange={e => setAgeMax(Number(e.target.value))} />
        <label>Zip Code</label>
        <Input onChange={e => setZipCode([Number(e.target.value)])} />
      </div>
      <Button onPress={onButtonSearch}>Search</Button>

      <div>
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

export default DogFilter;
