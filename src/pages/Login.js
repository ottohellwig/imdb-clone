import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import "./Login.css";

const login = (email, password, onSuccess, onError) => {
  const API_URL = "http://131.181.190.87:3000";
  const url = `${API_URL}/user/login`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 400) {
        throw new Error("Invalid login request");
      } else if (res.status === 401) {
        return res.json().then((data) => {
          throw new Error(data.message);
        });
      } else {
        throw new Error("Unknown error");
      }
    })
    .then((data) => {
      // Outputting token into console for testing
      console.log("Bearer token:", data.bearerToken.token);
      console.log("Refresh token:", data.refreshToken.token);
      localStorage.setItem("refreshToken", data.refreshToken.token);
      localStorage.setItem("bearerToken", data.bearerToken.token);
      onSuccess();
    })
    .catch((error) => onError(error.message));
};

// Fetch POST to trade tokens (refreshToken for bearer + refresh)
export const refreshTokens = () => {
  const API_URL = "http://131.181.190.87:3000";
  const url = `${API_URL}/user/refresh`;
  const refreshToken = localStorage.getItem("refreshToken");

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ refreshToken }),
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 401) {
        throw new Error("Invalid refresh token");
      } else {
        throw new Error("Unknown error");
      }
    })
    .then((data) => {
      console.log("New bearer token:", data.bearerToken.token);
      console.log("New refresh token:", data.refreshToken.token);
      localStorage.setItem("refreshToken", data.refreshToken.token);
      localStorage.setItem("bearerToken", data.bearerToken.token);
    })
    .catch((error) => console.error(error));
};

export default function LoginPage(props) {
  const navigate = useNavigate();
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleEmailChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(
      email,
      password,
      () => {
        console.log("Login successful!");
        props.setIsLoggedIn(true);
        navigate("/");
      },
      (errorMessage) => {
        setError(errorMessage);
      }
    );
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <Form className="login-form" onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">Email:</Label>
          <Input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email"
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password:</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
          />
        </FormGroup>
        <Button className="login-button" type="submit" color="primary">
          Login
        </Button>
      </Form>
      <p>
        <Link to="/register" className="link-signup">
          Don't have an account?
        </Link>
      </p>
    </div>
  );
}
