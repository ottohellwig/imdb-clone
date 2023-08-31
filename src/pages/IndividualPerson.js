import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./IndividualPerson.css";

export default function PersonDetails() {
  const [person, setPerson] = useState({});
  const [scores, setScores] = useState([]);
  const bearerToken = localStorage.getItem("bearerToken");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (!bearerToken) {
      navigate("/login");
      return;
    }

    const fetchPersonData = async () => {
      const response = await fetch(`http://131.181.190.87:3000/people/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + bearerToken,
        },
      });
      const data = await response.json();
      setPerson(data);
    };
    fetchPersonData();
  }, [id, bearerToken, navigate]);

  // Used for rechart to calculate IMDb Score Distribution:
  // If person has role -> create array "counts" of length 10 (initialise at 0)
  // Calculates score from imdbRating property of each person.roles array and adds 1 to the corresponding index of counts
  // Divide into 10 ranges and mapped to an array of objects with two properties: scoreRange and Count (scores state var)
  useEffect(() => {
    if (person.roles) {
      const counts = Array(10).fill(0);
      for (const role of person.roles) {
        const score = Math.floor(role.imdbRating);
        if (score >= 0 && score <= 9) {
          counts[score]++;
        }
      }

      const data = counts.map((Count, index) => {
        return {
          scoreRange: `${index}-${index + 1}`,
          Count: Count,
        };
      });
      setScores(data);
    }
  }, [person]);

  const columns = [
    { headerName: "Movie Name", field: "movieName", resizable: true },
    { headerName: "IMDB ID", field: "movieId", resizable: true },
    { headerName: "Category", field: "category", resizable: true },
    {
      headerName: "Characters",
      field: "characters",
      valueFormatter: (params) => params.value.join(",") || "N/A",
      resizable: true,
    },
    { headerName: "IMDB Rating", field: "imdbRating", resizable: true },
  ];

  return (
    <div className="person-container">
      <h1 className="person-title">{person.name}</h1>
      {person.birthYear && (
        <p className="yob-yod">
          Year of Birth: {person.birthYear}{" "}
          {person.deathYear && `- Year of Death: ${person.deathYear}`}
        </p>
      )}

      {person.roles && (
        <div
          className="ag-theme-alpine"
          style={{ height: "400px", width: "20%" }}
        >
          <AgGridReact rowData={person.roles} columnDefs={columns} />
        </div>
      )}

      <div className="imdb-chart">
        <BarChart width={800} height={400} data={scores}>
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <XAxis dataKey="scoreRange"></XAxis>
          <YAxis domain={[0, 25]} tickCount={6}></YAxis>
          <Tooltip />
          <Legend />
          <Bar dataKey="Count" fill="#1890ff" />
          <text x={400} y={30} textAnchor="middle" fontSize={20}>
            IMDb Score Distribution
          </text>
        </BarChart>
      </div>
    </div>
  );
}
