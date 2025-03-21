'use client';
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Input,
  useDisclosure,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { Dog } from './page';

export interface DogFilterProps {
  setDogs: (dogs: Dog[]) => void;
  setLoading: (loading: boolean) => void;
  setInitialFetch: (initialFetch: boolean) => void;
}

const DogFilter = ({
  setDogs,
  setLoading,
  setInitialFetch,
}: DogFilterProps) => {
  const [dogBreeds, setDogBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<Set<string>>(new Set());
  const [ageMin, setAgeMin] = useState<number>(0);
  const [ageMax, setAgeMax] = useState<number>(0);
  const [zipCode, setZipCode] = useState<number[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setDogBreeds(data));
  }, []);

  const sortArrayByBreed = (dogs: Dog[]): Dog[] => {
    return dogs.sort((a, b) => a.breed.localeCompare(b.breed));
  };

  const checkArrayLength = <T,>(array: T[]): boolean => {
    return array.length > 0;
  };

  const appendParams = <T,>(
    value: T | T[],
    params: URLSearchParams,
    paramKey: string
  ): void => {
    if (Array.isArray(value)) {
      const arrayGreaterThanZero: boolean = checkArrayLength<T>(value);

      if (!arrayGreaterThanZero) {
        return;
      }
      value.forEach((item: T) => {
        params.append(paramKey, String(item));
      });
    } else if (typeof value === 'number' && value > 0) {
      params.append(paramKey, String(value));
    }
  };
  const returnFilteredIds = async (): Promise<string[]> => {
    const breedsArray: string[] = Array.from(selectedBreeds);
    const resultIds: string[] = [];

    const initialParams: URLSearchParams = new URLSearchParams();

    appendParams<string>(breedsArray, initialParams, 'breeds');
    appendParams<number>(zipCode, initialParams, 'zipCode');
    appendParams<number>(ageMin, initialParams, 'ageMin');
    appendParams<number>(ageMax, initialParams, 'ageMax');
    setLoading(true);
    setInitialFetch(true);

    try {
      const response = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs/search?${initialParams}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      let next = json.next;

      while (next !== null) {
        const response = await fetch(
          'https://frontend-take-home-service.fetch.com' + next,
          {
            method: 'GET',
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        if (!json.next) {
          break;
        }
        next = json.next;
        resultIds.push(...json.resultIds);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    return resultIds;
  };

  const fetchDogInfo = async (resultId: string[]): Promise<Dog[]> => {
    const response = await fetch(
      'https://frontend-take-home-service.fetch.com/dogs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resultId),
      }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json: Dog[] = await response.json();
    return json;
  };

  const onButtonSearch = async () => {
    const resultIds: string[] = await returnFilteredIds();
    let totalDogs: Dog[] = [];

    for (let i = 0; i < resultIds.length; i += 100) {
      const slicedArray: string[] = resultIds.slice(i, i + 100);
      const dogs: Dog[] = await fetchDogInfo(slicedArray);
      totalDogs.push(...dogs);
    }

    totalDogs = sortArrayByBreed(totalDogs);

    setDogs(totalDogs);
  };

  const DogInputFields = () => {
    return (
      <div>
        <label className='font-bold'>Age min</label>
        <Input onChange={e => setAgeMin(Number(e.target.value))} />
        <label className='font-bold'>Age max</label>
        <Input onChange={e => setAgeMax(Number(e.target.value))} />
        <label className='font-bold'>Zip Code</label>
        <Input onChange={e => setZipCode([Number(e.target.value)])} />
      </div>
    );
  };

  return (
    <div className=' mb-4 mt-4 sm:justify-center'>
      <div className='flex justify-end w-screen'>
        <Button
          className='mr-4'
          variant='bordered'
          onPress={onOpen}
          onClickCapture={onOpen}
        >
          Filter Dogs
        </Button>
      </div>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement='left'>
        <DrawerContent>
          {onClose => (
            <>
              <DrawerHeader>
                Dog Filter
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}
                ></Button>
              </DrawerHeader>
              <DrawerBody>
                <div className='flex justify-end'>
                  <Button
                    onPress={() => {
                      onButtonSearch();
                      onClose();
                    }}
                  >
                    Search
                  </Button>
                </div>
                <DogInputFields />
                <Accordion className='h-screen overflow-y-auto rounded-lg'>
                  <AccordionItem
                    title='Dog Breeds'
                    subtitle={<span>Press to expand</span>}
                  >
                    {dogBreeds.map(breed => (
                      <div className='flex' key={breed}>
                        <Checkbox
                          checked={selectedBreeds.has(breed)}
                          onChange={() => {
                            if (selectedBreeds.has(breed)) {
                              setSelectedBreeds(
                                new Set(selectedBreeds.values())
                              );
                            } else {
                              setSelectedBreeds(
                                new Set([...selectedBreeds, breed])
                              );
                            }
                          }}
                        />
                        {breed}
                      </div>
                    ))}
                  </AccordionItem>
                </Accordion>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DogFilter;
