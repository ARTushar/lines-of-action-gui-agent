import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, Paper, TextField,  } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux';
import { finishGame } from '../redux/actioncreators';
import { getWinner } from '../game-logic/winningLogic';
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

  const { board, currentPlayer, latestBlackMove, latestWhiteMove, totalBlackCells, totalWhiteCells } = useSelector(state => state.board);
  const winner = useSelector(state => state.game.winner);

  const dispatch = useDispatch();
  const minute = Math.floor(elapsedTime / 60);
  const sec = elapsedTime % 60;

  const getCurrentTurn = (player) =>{
    return player === 'black' ? firstPlayerName.toUpperCase(): secondPlayerName.toUpperCase();
  }

  useEffect(() => {
    if(!latestBlackMove || !latestWhiteMove) return;
    let lastMoveByCurrent, lastMoveByOpposition, currentCells, oppostionCells;
    if(currentPlayer === 'white'){
      lastMoveByCurrent = latestBlackMove;
      currentCells = totalBlackCells;
      lastMoveByOpposition = latestWhiteMove;
      oppostionCells = totalWhiteCells;
    } else {
      lastMoveByCurrent = latestWhiteMove;
      currentCells = totalWhiteCells;
      lastMoveByOpposition = latestBlackMove;
      oppostionCells = totalBlackCells;
    }

    let winner = getWinner(board, lastMoveByCurrent, lastMoveByOpposition, currentCells, oppostionCells)
    console.log(winner);
    if(winner){
      dispatch(finishGame(winner, elapsedTime))
    }
  }, [currentPlayer])

  useEffect(() => {
    let timer;
    if(firstPlayerName && !winner.length){
      // dispatch(startTimer());
      timer = setInterval(() => setElapsedTime(elapsedTime + 1), 1000)
    } else if(winner.length){
      setElapsedTime(0);
    }
    return () => {
      if(timer) clearInterval(timer);
    }
  }, [elapsedTime, firstPlayerName, winner])

  return (
    <Paper elevation={3} className={classes.paper}>
      {firstPlayerName.length !== 0 ? (
        <h3>{winner.length === 0 ? getCurrentTurn(currentPlayer) + "'s Turn" : getCurrentTurn(winner) + ' WON!!!!'}</h3>
      ) : (null)
      }
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
