import React, { useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import LoggedIn from '../components/LoginContext';
import { Button } from '@material-ui/core';

import '../style/NavBar.css';

const NavBar = () => {
  const { loggedIn, setLoggedInHelper } = useContext(LoggedIn);

  const handleClick = async () => {
    if (!loggedIn.loggedIn) {
      window.location.href = '/login';
    } else {
      const response = await fetch('/auth/logout');

      if (response.status === 200) {
        setLoggedInHelper(false, null, null, [], false);
        window.location.href = '/';
      } else {
        alert('Failed to log out. Please contact the developer.');
      }
    }
  };

  return (
    <Navbar className="navbar" bg="light" sticky="top">
      <Navbar.Brand href="/">Apt Finder</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Item as="li" className="p-1">
          <Nav.Link href="/savelist">Save List</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li" className="p-1">
          <Nav.Link href="/admin">Admin Page</Nav.Link>
        </Nav.Item>
      </Nav>
      <Button onClick={handleClick}>
        {loggedIn.loggedIn ? 'Sign Out' : 'Sign In'}
      </Button>
    </Navbar>
  );
};

export default NavBar;
