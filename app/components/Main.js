import { Grid, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import Board from './Board';
import GameDisplay from './GameDisplay';
import GameStart from './GameStart';
import GameFinish from './GameFinish';

function Main() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div >
      <GameStart isOpen={isOpen} setIsOpen={setIsOpen} />
      <GameFinish setGameStart={setIsOpen} />
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
          <Grid item align="right" md={6} style={{
            paddingRight: '50px'
          }}>
            <Board />
          </Grid>
          <Grid item  md={6} style={{
            padding: '15px 20px 20px 30px'
          }}>
            <GameDisplay setIsOpen={setIsOpen} />
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default Main;
