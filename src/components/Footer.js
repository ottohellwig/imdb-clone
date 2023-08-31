import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="container">
        <p className="text-center">
          All data is from IMDB, Metacritic and RottenTomatoes.
        </p>
        <p className="text-center">
          &copy; {new Date().getFullYear()} Otto Hellwig.
        </p>
      </div>
    </footer>
  );
};
