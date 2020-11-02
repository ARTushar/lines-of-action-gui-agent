import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, MenuItem, Modal, Paper, TextField,  } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux';
// import { startTimer } from '../redux/actioncreators';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(2),
      // width: '25ch'
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    padding: '10px',
    maxWidth: '250px',
    minHeight: '340px'
  },
}));

function GameDisplay() {
  const classes = useStyles();

  const {firstPlayerName, secondPlayerName} = useSelector(state => state.game)
  const [elapsedTime, setElapsedTime] = useState(0);

  const currentPlayer = useSelector(state => state.board.currentPlayer);

  // const dispatch = useDispatch();
  const minute = Math.floor(elapsedTime / 60);
  const sec = elapsedTime % 60;

  const getCurrentTurn = (player) =>{
    return player === 'black' ? firstPlayerName: secondPlayerName;
  }

  useEffect(() => {
    let timer;
    if(firstPlayerName){
      // dispatch(startTimer());
      timer = setInterval(() => setElapsedTime(elapsedTime + 1), 1000)
    }
    return () => {
      if(timer) clearInterval(timer);
    }
  }, [elapsedTime, firstPlayerName])

  return (
    <Paper elevation={3} className={classes.paper}>
       <h3>{getCurrentTurn(currentPlayer) + "'s Turn"}</h3>
        <Grid container direction="row" justify="center" alignItems="center">
        <form
          className={classes.root}
        >
          <Grid item>
            <TextField
              label='First Player Name (Blue)'
              value={firstPlayerName}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Second Player Name (Red)'
              value={secondPlayerName}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Time Elapsed (m : s)'
              value={minute + ' : ' + sec}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
        </form>
        </Grid>
      </Paper>
  )
}

export default GameDisplay;
