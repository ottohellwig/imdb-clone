import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Components
import { Footer } from "./components/Footer";
import Navigation from "./components/Navigation";

// Pages
import { Home } from "./pages/Home";
import MovieTable from "./pages/MovieSearch";
import { refreshTokens } from "./pages/Login";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import PersonDetails from "./pages/IndividualPerson";

export default function App() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Checks if user has refreshToken, if not, don't setInterval
  // useEffect setInterval which calls refreshToken to refresh the tokens every 300000s (5min)
  useEffect(() => {
    const hasToken = localStorage.getItem("refreshToken");
    if (hasToken) {
      console.log("refreshTokens interval set");
      const intervalId = setInterval(refreshTokens, 300000);
      return () => clearInterval(intervalId);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navigation setIsLoggedOut={setIsLoggedOut} isLoggedOut={isLoggedOut} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MovieTable />} />
        <Route path="/movies/details/:imdbID" element={<MovieDetails />} />
        <Route path="/people/id/:id" element={<PersonDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
