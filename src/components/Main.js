import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import Board from './Board';

function Main() {
  return (
    <div >
      <Paper style={{
      minHeight: '100vh',
      padding: '20px'
    }} elevation={3}>
      <h4>
        LINES OF CODE
      </h4>
      <Board />
      </Paper>
    </div>
  )
}

export default Main;
