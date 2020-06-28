import React from "react";
import * as MovieAPI from "./MovieAPI";
import Movie from "./Movie";
import { Link } from "react-router-dom";

class MovieList extends React.Component {
  state = {
    selectedMovies: [],
    queryString: "",
  };

  updateMyList = (movie) => {
    if (movie.my_list) {
      MovieAPI.removeFromList(movie)
      .then(() => {
        MovieAPI.getAll().then((movies) => {
          let selectedMovies = movies.filter((movie) => movie.my_list === true);
          this.setState({ selectedMovies });
        });
      });
    }
  };

  componentDidMount() {
    MovieAPI.getAll()
    .then((movies) => {
      let selectedMovies = movies.filter((movie) => movie.my_list === true);
      this.setState({ selectedMovies });
    });
  }

  updateQuery = (e) => {
    this.setState({ queryString: e.target.value });
  };

  render = () => {
    let movieSearch = [...this.state.selectedMovies];
    if (this.state.queryString.length > 0) {
      movieSearch = movieSearch.filter((movie) =>
        movie.title.toLowerCase().includes(this.state.queryString)
      );
    }
    return (
      <>

        {/* header that includes the searchbar and
        input tab to allow users search for movies */}
        <header className="header">
          <Link to="/"><img src="https://fontmeme.com/permalink/190707/fd4735271a0d997cbe19a04408c896fc.png" alt="netflix-font" border="0"/>
          </Link>
          <div id="navigation" className="navigation">
            <nav>
              <ul>
                <li>
                  <Link to="/myList">My List</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* the search bar that contains the 
          form and input text bar on the Home page */}
          <form id="search" className="search">
            <input type="search" placeholder="Search for a title..." value={this.state.queryString} onChange={this.updateQuery}/>
            <div className="searchResults"></div>
          </form>
        </header>
        <div className="titleList">
          <div className="title">
            <h1>My List</h1>
            <div className="titles-wrapper">
              {movieSearch.map((movie) => ( <Movie updateMyList={this.updateMyList} movie={movie} key={movie.id} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };
}

export default MovieList;
