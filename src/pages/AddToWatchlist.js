import React, { useState } from 'react';
import { TextField, MenuItem, Button, Dialog, DialogContent, CircularProgress, Autocomplete } from '@mui/material';
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

const AddToWatchlist = ({ watchlist, setWatchlist }) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('');
  const [genre, setGenre] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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
      setLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=0d9082f38437d0ce2713e712e4b7fef4&query=${title}`);
      if (response.data.results.length === 0) {
        throw new Error('No movie found with that title.');
      }

      const movieId = response.data.results[0].id;
      const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=0d9082f38437d0ce2713e712e4b7fef4`);
      const posterPath = movieDetails.data.poster_path;
      const rating = movieDetails.data.vote_average;
      const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=0d9082f38437d0ce2713e712e4b7fef4`);
      const cast = creditsResponse.data.cast?.slice(0, 3).map(actor => actor.name) || [];

      const newMovie = { title, platform, genre, link, posterPath, rating, cast };
      setWatchlist(prevWatchlist => [...prevWatchlist, newMovie]); // Update watchlist state
      setMessage(`${title} added to the watchlist.`);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      alert('Failed to add movie to watchlist. Please try again.');
    } finally {
      setLoading(false);
    }

    setTitle('');
    setPlatform('');
    setGenre('');
    setLink('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
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
  );
};

export default AddToWatchlist;
