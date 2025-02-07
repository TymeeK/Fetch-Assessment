'use client';
import { Navbar, NavbarBrand, NavbarContent, Link } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Nav = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const response = await fetch(
      'https://frontend-take-home-service.fetch.com/auth/logout'
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    router.push('/login');
  };

  return (
    <Navbar>
      <NavbarBrand>
        <p>Doggos</p>
      </NavbarBrand>
      <NavbarContent>
        <Link href='/login' onPress={handleLogout}>
          Logout
        </Link>
      </NavbarContent>
    </Navbar>
  );
};

export default Nav;
