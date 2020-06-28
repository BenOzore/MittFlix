import React from "react";
import * as MovieAPI from "./MovieAPI";
import Movie from "./Movie";
import MovieList from "./MovieList";
import { Route, Switch, Link } from "react-router-dom";

class App extends React.Component {
  state = {
    movies: [],
    queryString: "",
    genres: [],
    
  };

  //Populating the home page with perfoming
  //fetches using the componentDidMount Function
  componentDidMount = () => {
    MovieAPI.getAll()
    .then((movies) => {
      this.setState({ movies });
    });
    MovieAPI.genres()
    .then((genres) => {
      this.setState({ genres });
    });
  };

  updateQuery = (e) => {
    this.setState({ queryString: e.target.value });
  };

  // a mothod that will run when users click on
  // the + sign on a movie poster to add the
  // movie to favourite list
  updateMyList = (movies) => {
    if (movies.my_list) {
      MovieAPI.removeFromList(movies)
      .then(() => {
        MovieAPI.getAll()
        .then((movies) => {
          this.setState({ movies });
        });
      });
    } else {
      MovieAPI.addToList(movies)
      .then(() => {
        MovieAPI.getAll()
        .then((movies) => {
          this.setState({ movies });
        });
      });
    }
  };

  render = () => {
    let movieSearch = [...this.state.movies]
    if (this.state.queryString.length > 0) {
      movieSearch = movieSearch.filter(movie => movie.title.toLowerCase().includes(this.state.queryString))
    }

    return (
      <Switch>

        {/* link to the page where movies that were 
        selected by user as favourite movies are 
        stored and this page also displays the movies */}
        <Route exact path="/myList">
          <MovieList />
        </Route>

        {/* a link on the MITTFLIX logo that connects 
        users from the favourite movies list to 
        the home page where all the movies are found */}
        <Route exact path="/">
          
          {/* header that includes the searchbar and
          input tab to allow users search for movies */}

          <header className="header">
            <Link to="/">
              <img src="https://fontmeme.com/permalink/190707/fd4735271a0d997cbe19a04408c896fc.png" alt="netflix-font" border="0"/>
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

            <form id="search" className="search" > 
              <input type="search" placeholder="Search for a title..." value={this.state.queryString} onChange={this.updateQuery}/>
              {this.state.queryString.length > 0 ? <div className="searchResults">
                Found {movieSearch.length} movies with query "{this.state.queryString}"</div> :""}
            </form>
          </header>

          {/* In here, i sorted out the movie genres alphabetically
          and this renders the movie component after filtering 
          all the movies and placing them in the right genre they 
          belong to on the home page */}

          <div className="titleList">
            {this.state.genres.sort((genreNameOne, genereNameTwo) => genreNameOne.name.localeCompare(genereNameTwo.name)).map((genre) => (
              <div className="title" key={genre.id}>
                <h1>{genre.name}</h1>
                <div className="titles-wrapper">
                  {movieSearch.filter((movie) => movie.genre_ids.includes(genre.id)).map((movie) => (
                    <Movie movie={movie} key={movie.id} updateMyList={this.updateMyList} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Route>
      </Switch>
    );
  };
}

export default App;
