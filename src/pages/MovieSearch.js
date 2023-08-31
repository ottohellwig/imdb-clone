import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./MovieSearch.css";

const paginationPageSize = 100;

export default function MovieTable() {
  const [gridApi, setGridApi] = useState(null);
  const [titleFilter, setTitleFilter] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const navigate = useNavigate();

  const createDataSource = async () => {
    const dataSource = {
      getRows: (params) => {
        console.log(params);
        let pageNo = params.endRow / paginationPageSize;
        // Credits and appreciation to Chad Gay for uploading the infinite scroll with pagination example,
        // I had adapted the pageNo and params.successCallback to work. I had used his example as reference for infinite scrolling with pagination.
        let url = `http://sefdb02.qut.edu.au:3000/movies/search?page=${pageNo}`;

        if (titleFilter !== "") {
          url += `&title=${titleFilter}`;
        }

        if (selectedYear !== null) {
          url += `&year=${selectedYear}`;
        }

        console.log("pageNo", pageNo);
        console.log("url", url);

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            params.successCallback(data.data, data.pagination.total);
          });
      },
    };

    return dataSource;
  };

  const onGridReady = async (params) => {
    setGridApi(params.api);

    const dataSource = await createDataSource();

    params.api.setDatasource(dataSource);
  };

  // Event handler to create new data source for gridAPI
  const onYearFilterChanged = async (event) => {
    setSelectedYear(event.target.value);
    const dataSource = await createDataSource();
    gridApi.setDatasource(dataSource);
  };

  const onTitleFilterChanged = async (event) => {
    setTitleFilter(event.target.value);
    const dataSource = await createDataSource();
    gridApi.setDatasource(dataSource);
  };

  // Function to generate array of years (1990 to current year)
  const getYears = () => {
    const startYear = 1990;
    const endYear = new Date().getFullYear();
    const years = [];

    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return years;
  };

  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      enableRowGroup: false,
      enablePivot: false,
      enableValue: true,
      sortable: false,
      resizable: true,
      filter: false,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const columnDefs = useMemo(() => {
    return [
      { headerName: "Title", field: "title" },
      { headerName: "Year", field: "year" },
      { headerName: "IMDb Rating", field: "imdbRating" },
      {
        headerName: "Rotten Tomatoes Rating",
        field: "rottenTomatoesRating",
        valueFormatter: (params) => {
          if (params.value === null) {
            return "";
          } else {
            return params.value + "%";
          }
        },
      },
      { headerName: "Metacritic Rating", field: "metacriticRating" },
      { headerName: "Classification", field: "classification" },
    ];
  }, []);

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,
    rowModelType: "infinite",
    paginationPageSize: paginationPageSize,
    pagination: true,
    onGridReady: onGridReady,
    cacheBlockSize: paginationPageSize,
    suppressBrowserResizeObserver: true,
  };

  return (
    <div className="movie-table-container">
      <h2 className="movie-table-title">Movie List</h2>
      <div className="movie-table-searchbar">
        <input
          type="text"
          placeholder="Search for movie title"
          value={titleFilter}
          onChange={onTitleFilterChanged}
        />
      </div>
      <div className="movie-table-dropdown">
        <select id="year-filter" onChange={onYearFilterChanged}>
          <option value="">All Years</option>
          {getYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="movie-table">
        <div
          className="ag-theme-alpine"
          style={{ height: "80vh", width: "70%" }}
        >
          <AgGridReact
            gridOptions={gridOptions}
            onRowClicked={(row) =>
              navigate(`/movies/details/${row.data.imdbID}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
