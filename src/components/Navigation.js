import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import axios from "axios";
import "./Navigation.css";

function Navigation(props) {
  const hasToken = localStorage.getItem("bearerToken");
  const handleLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    axios
      .post("http://131.181.190.87:3000/user/logout", {
        refreshToken: refreshToken,
      })
      .then(() => {
        localStorage.removeItem("bearerToken");
        localStorage.removeItem("refreshToken");
        props.setIsLoggedOut(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return hasToken ? (
    <Navbar light expand="md">
      <NavbarBrand href="/">Movie Data</NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink href="/">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/Movies">Movies</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/" onClick={handleLogout}>
            Logout
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  ) : (
    <Navbar light expand="md">
      <NavbarBrand href="/">Movie Data</NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink href="/">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/Movies">Movies</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/Register">Register</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/Login">Login</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
}

export default Navigation;
