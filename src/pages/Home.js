import "./Home.css";

export const Home = () => {
  return (
    <div className="card homepage-card">
      <img
        src="/images/homepage_card.jpg"
        alt="Homepage Event Card"
        className="card-img-top"
      />
      <div className="card-body">
        <h2 className="card-title">Welcome to Movie Data</h2>
        <p className="card-text">
          You can browse movies, view movie pages, and individual persons
          starring in the movies. Feel free to explore!
        </p>
      </div>
    </div>
  );
};
