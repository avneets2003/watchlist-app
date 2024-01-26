import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import AddToWatchlist from './pages/AddToWatchlist';
import Watchlist from './pages/Watchlist';

const App = () => {
  const [watchlist, setWatchlist] = useState([]); // Define watchlist state

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
          <Route path="/" element={<AddToWatchlist setWatchlist={setWatchlist} />} /> {/* Pass setWatchlist as a prop */}
          <Route path="/watchlist" element={<Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />} /> {/* Pass watchlist and setWatchlist as props */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
