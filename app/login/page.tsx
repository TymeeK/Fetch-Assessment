'use client';
import { Input, Button, Card } from '@heroui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const [loginError, setLoginError] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleLoginRequest = async () => {
    const response = await fetch(
      'https://frontend-take-home-service.fetch.com/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include',
      }
    );
    if (!response.ok) {
      setLoginError(true);
      throw new Error('Network response was not ok');
    }
    router.push('/dogs');
  };

  return (
    <div className='w-screen h-screen'>
      <div className='flex flex-col justify-center pt-20'>
        <h1 className='text-center m-5'>Login</h1>

        <Card className='w-1/4 mx-auto'>
          <div className='flex flex-col'>
            <div className='flex flex-col m-3'>
              <label className='font-bold ' htmlFor='name'>
                Name
              </label>
              <Input name='name' size='md' onChange={handleNameChange} />
            </div>
            <div className='flex flex-col m-3'>
              <label className='font-bold' htmlFor='email'>
                Email
              </label>
              <Input
                name='email'
                type='email'
                size='md'
                onChange={handleEmailChange}
              />
            </div>

            <div className='flex justify-center'>
              <Button
                className='m-3 w-8'
                color='primary'
                size='sm'
                onPress={handleLoginRequest}
              >
                Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
