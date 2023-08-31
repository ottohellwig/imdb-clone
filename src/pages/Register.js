import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import "./Register.css";

export default function RegisterForm() {
  const API_URL = "http://131.181.190.87:3000";

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    name === "email" ? setEmail(value) : setPassword(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `${API_URL}/user/register`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 201) {
        const data = await res.json();
        console.log(data);
        navigate("/login");
      } else if (res.status === 409) {
        throw new Error("User already exists");
      } else if (res.status === 400) {
        throw new Error("Bad request");
      } else if (res.status === 429) {
        throw new Error("Rate limit exceeded");
      }
    } catch (err) {
      setError("Failed to register user");
      console.error("Error: ", err);
      window.alert("Error, user already exists or empty field");
    }
  };

  return (
    <div className="RegisterContainer">
      <Form onSubmit={handleSubmit} className="RegisterForm">
        <h2 className="RegisterTitle">Register</h2>
        <FormGroup>
          <Label for="email" className="RegisterEmailLabel">
            Email:
          </Label>
          <Input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={handleChange}
            className="RegisterEmailInput"
            placeholder="Enter email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="password" className="RegisterPwordLabel">
            Password:
          </Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleChange}
            className="RegisterPwordInput"
            placeholder="Enter password"
          />
        </FormGroup>
        <Button className="RegisterButton" color="primary" type="submit">
          Register
        </Button>
      </Form>
      <p>
        <Link to="/login" className="link-signup">
          Already have an account?
        </Link>
      </p>
    </div>
  );
}
