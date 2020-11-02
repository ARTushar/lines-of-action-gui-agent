import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import Board from './Board';
import GameDisplay from './GameDisplay';
import GameStart from './GameStart';

function Main() {
  return (
    <div >
      <GameStart />
      <Paper style={{
      minHeight: '100vh',
      padding: '20px'
    }} elevation={3}>
      <h2 style={{
        marginBottom: '50px'
      }}>
        LINES OF CODE
      </h2>
      <Grid container justify="center">
          <Grid item align="right" xs={6} style={{
            paddingRight: '50px'
          }}>
            <Board />
          </Grid>
          <Grid item  xs={4} style={{
            padding: '15px 20px 20px 30px'
          }}>
            <GameDisplay />
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default Main;
