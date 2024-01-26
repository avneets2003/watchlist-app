import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { TextField, MenuItem, Button, AppBar, Toolbar, Typography, Dialog, DialogContent, Card, CardContent, DialogActions, Box, Autocomplete, CircularProgress } from '@mui/material';
import axios from 'axios';

const platforms = [
  { value: 'Amazon Prime Video', label: 'Amazon Prime Video' },
  { value: 'Disney+ Hotstar', label: 'Disney+ Hotstar' },
  { value: 'Netflix', label: 'Netflix' },
];

const genres = [
  { value: 'Action', label: 'Action' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Romance', label: 'Romance' },
];

const Form = () => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [genre, setGenre] = useState('');
  const [link, setLink] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleAutofill = debounce(async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=0d9082f38437d0ce2713e712e4b7fef4&query=${query}`);
      const movieTitles = response.data.results.map(result => result.title);
      setSearchResults(movieTitles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
      setLoading(false);
    }
  }, 500);

  const handleTitleChange = (event, value) => {
    setTitle(value);
    handleAutofill(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !platform || !genre || !link) {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=0d9082f38437d0ce2713e712e4b7fef4&query=${title}`);
      if (response.data.results.length === 0) {
        throw new Error('No movie found with that title.');
      }

      const movieId = response.data.results[0].id;
      const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=0d9082f38437d0ce2713e712e4b7fef4`);
      const posterPath = movieDetails.data.poster_path;

      const newMovie = { title, platform, genre, link, posterPath };
      setWatchlist([...watchlist, newMovie]);
      setMessage(`${title} added to the watchlist.`);
      setOpenDialog(true);
      
      // Clear search results
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      alert('Failed to add movie to watchlist. Please try again.');
    }

    setTitle('');
    setPlatform('');
    setGenre('');
    setLink('');
  };

  const handleDelete = () => {
    const updatedWatchlist = [...watchlist];
    updatedWatchlist.splice(deleteIndex, 1);
    setWatchlist(updatedWatchlist);
    setDeleteIndex(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ marginRight: 'auto' }}>
              Watchlist App
            </Typography>
            <Typography variant="h6" component={Link} to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>
              Add to Watchlist
            </Typography>
            <Typography variant="h6" component={Link} to="/watchlist" style={{ color: '#fff', textDecoration: 'none', marginRight: 20 }}>
              Watchlist
            </Typography>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route
            path="/"
            element={
              <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
                <Autocomplete
                  fullWidth
                  freeSolo
                  value={title}
                  onChange={handleTitleChange}
                  options={searchResults}
                  loading={loading} // Add the loading prop
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Movie Title"
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null} {/* Add loading icon */}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                      onChange={(e) => handleTitleChange(e, e.target.value)}
                    />
                  )}
                />
                <TextField
                  select
                  label="Platform"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  {platforms.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Genre"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                >
                  {genres.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Link"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '10px' }}>
                  Submit
                </Button>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogContent>
                    <div style={{ marginBottom: '10px' }}>
                      {message}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Button variant="outlined" onClick={handleCloseDialog}>Close</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </form>
            }
          />
          <Route
            path="/watchlist"
            element={
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '50px' }}>
                {watchlist.map((movie, index) => (
                  <Card key={index} style={{ position: 'relative', width: '300px', margin: '10px' }}>
                    <CardContent>
                      {movie.posterPath && (
                        <img src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} alt={`${movie.title} Poster`} style={{ width: '100%', marginBottom: '10px' }} />
                      )}
                      <Typography variant="h5" style={{ marginBottom: '10px' }}>
                        <a href={movie.link.startsWith('http') ? movie.link : `http://${movie.link}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#000' }}>{movie.title}</a>
                      </Typography>
                      <Typography variant="body1" style={{ marginBottom: '10px' }}>Platform: {movie.platform}</Typography>
                      <Typography variant="body1" style={{ marginBottom: '10px' }}>Genre: {movie.genre}</Typography>
                      <Box display="flex" justifyContent="flex-end" marginTop="10px">
                        <Dialog open={deleteIndex === index} onClose={() => setDeleteIndex(null)}>
                          <DialogContent style={{ maxWidth: '400px' }}>
                            <Typography variant="body1" style={{ marginBottom: '10px' }}>
                              Are you sure you want to delete "{movie.title}" from the watchlist?
                            </Typography>
                            <DialogActions style={{ justifyContent: 'flex-end' }}>
                              <Button variant="outlined" onClick={handleDelete}>
                                Delete
                              </Button>
                              <Button variant="outlined" onClick={() => setDeleteIndex(null)}>
                                Cancel
                              </Button>
                            </DialogActions>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outlined" onClick={() => setDeleteIndex(index)}>Delete</Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default Form;
