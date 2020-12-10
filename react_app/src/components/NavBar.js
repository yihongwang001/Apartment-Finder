import React, { useContext } from 'react';
import { Button, Nav, Navbar } from 'react-bootstrap';
import LoggedIn from '../components/LoginContext';
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
    <Navbar className="navbar" bg="light" expand="lg">
      <Navbar.Brand href="/">Apt Finder</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Item as="li" className="p-1">
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li" className="p-1">
          <Nav.Link href="/admin">Admin Page</Nav.Link>
        </Nav.Item>
      </Nav>
      <Button variant="outline-secondary" onClick={handleClick}>
        {loggedIn.loggedIn ? 'Sign Out' : 'Sign In'}
      </Button>
    </Navbar>
  );
};

export default NavBar;
