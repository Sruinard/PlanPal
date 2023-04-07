import React from 'react';
import './App.css';
import Chat from './views/Chat';
// import grid
import { Grid } from '@mui/material';

function App() {
  return (
    <div className="App">
        {/* <Grid container>
          
        </ Grid> */}
        <header>
            <h1>PlanPal</h1>
        </header>
        <Chat />
    </div>
  );
}

export default App;
