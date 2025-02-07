'use client';
import { Input, Button } from '@heroui/react';
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
    <div>
      <h1>Login</h1>
      <label htmlFor='name'>Name</label>
      <Input name='name' onChange={handleNameChange} />
      <label htmlFor='email'>Email</label>
      <Input name='email' onChange={handleEmailChange} />
      <Button onPress={handleLoginRequest}>Login</Button>
    </div>
  );
};

export default Login;
