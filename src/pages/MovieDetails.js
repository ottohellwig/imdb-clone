import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Table } from "reactstrap";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./MovieDetails.css";

const principalsColumnDefs = [
  { headerName: "Role", field: "category" },
  {
    headerName: "Name",
    field: "name",
    cellRendererFramework: (params) => (
      <Link to={`/people/id/${params.data.id}`}>{params.value}</Link>
    ),
  },
  {
    headerName: "Characters",
    field: "characters",
    valueFormatter: (params) => params.value.join(", ") || "",
  },
];

function MovieDetails() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState({});

  useEffect(() => {
    const fetchMovieData = async () => {
      const response = await fetch(
        `http://131.181.190.87:3000/movies/data/${imdbID}`
      );
      const data = await response.json();
      setMovie(data);
    };
    fetchMovieData();
  }, [imdbID]);

  return (
    <div className="MovieDetailsContainer">
      <div className="MoviePosterAndInfo">
        <div className="MoviePoster">
          <h2 className="MovieTitle">{movie.title}</h2>
          <p>
            {movie.poster && (
              <img className="image" src={movie.poster} alt="Movie poster" />
            )}
          </p>
        </div>
        <div className="MovieInfo">
          <div className="MoviePlot">
            <p>{movie.plot}</p>
          </div>
          <div>
            <Table>
              <tbody>
                <tr>
                  <td>Released in:</td>
                  <td>{movie.year}</td>
                </tr>
                <tr>
                  <td>Runtime:</td>
                  <td>{movie.runtime} minutes</td>
                </tr>
                {movie.genres && (
                  <tr>
                    <td>Genres:</td>
                    <td>{movie.genres.join("  ")}</td>
                  </tr>
                )}
                <tr>
                  <td>Country:</td>
                  <td>{movie.country}</td>
                </tr>
                <tr>
                  <td>Box Office:</td>
                  <td>${movie.boxoffice}</td>
                </tr>
              </tbody>
            </Table>
            {movie.ratings && (
              <Table className="RatingsTable">
                <tbody>
                  {movie.ratings.map((ratings) => (
                    <tr key={ratings.source}>
                      <td>{ratings.source}: </td>
                      <td>{ratings.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>
      {movie.principals && (
        <div
          className="ag-theme-alpine"
          style={{ height: 300, maxWidth: "auto" }}
        >
          <AgGridReact
            columnDefs={principalsColumnDefs}
            rowData={movie.principals}
            autoSizeColumns={true}
          />
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
