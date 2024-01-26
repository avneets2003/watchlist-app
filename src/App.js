import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { TextField, MenuItem, Button, AppBar, Toolbar, Typography, Dialog, DialogContent, Card, CardContent, DialogActions, Box } from '@mui/material';

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

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Check if any of the required fields are empty
    if (!title || !platform || !genre || !link) {
      alert('Please fill in all the fields.');
      return;
    }

    // Handle form submission
    const newMovie = { title, platform, genre, link };
    setWatchlist([...watchlist, newMovie]);
    setMessage(`${title} added to the watchlist.`);
    setOpenDialog(true);

    // Clear the form
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
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
