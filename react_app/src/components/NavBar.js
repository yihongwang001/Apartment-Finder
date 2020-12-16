import React, { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Button } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import LoggedIn from "../components/LoginContext";
import getUser from "../utils/userUtil";

const NavBar = () => {
  const { loggedIn, setLoggedInHelper } = useContext(LoggedIn);

  const handleClick = async () => {
    if (!loggedIn.loggedIn) {
      window.location.href = "/login";
    } else {
      const response = await fetch("/auth/logout");

      if (response.status === 200) {
        setLoggedInHelper(false, null, null, false);
        window.location.href = "/";
      } else {
        alert("Failed to log out. Please contact the developer.");
      }
    }
  };

  const loginInfo = getUser();

  return (
    <Navbar className="navbar" bg="light" sticky="top">
      <Navbar.Brand className="mb-1" href="/">
        Apt Finder
      </Navbar.Brand>
      <Nav className="mr-auto">
        {loginInfo.username !== null && (
          <Nav.Item as="li" className="p-1">
            <Nav.Link href="/watchlist">Save List</Nav.Link>
          </Nav.Item>
        )}
        {loginInfo.adminAccess === true && (
          <Nav.Item as="li" className="p-1">
            <Nav.Link href="/admin">Admin Page</Nav.Link>
          </Nav.Item>
        )}
      </Nav>
      {loginInfo.username !== null && (
        <span>
          <PersonIcon />
          {loginInfo.username}
        </span>
      )}
      <Button onClick={handleClick}>
        {loggedIn.loggedIn ? "Sign Out" : "Sign In"}
      </Button>
    </Navbar>
  );
};

export default NavBar;
