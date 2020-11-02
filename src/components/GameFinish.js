import { Button, Grid, makeStyles, Modal, Paper, } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const getWinnerName = (winner, firstPlayerName, secondPlayerName) => {
  return winner === 'black' ? firstPlayerName.toUpperCase() : secondPlayerName.toUpperCase();
}


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
    width: '250px',
    minHeight: '300px',
    padding: '10px',
  },

}));


function GameFinish({setGameStart}) {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  const { winner, firstPlayerName, secondPlayerName, totalTimeTaken } = 
    useSelector(state => state.game)

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setGameStart(true);
  }

  useEffect(() => {
    if(winner.length){
      setIsOpen(true);
    }
  }, [winner])

  return (
    <Modal
      open={isOpen}
      className={classes.modal}
    >
      <Paper elevation={3} className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="center">
          <h2> {getWinnerName(winner, firstPlayerName, secondPlayerName) + ' WON!!!!'}</h2>
          <Grid item align="center">
            <h4>Total {totalTimeTaken} seconds elapsed!!</h4>
          </Grid>
          <form
            className={classes.root}
            onSubmit={handleSubmit}
          >
            <Grid item>
              <Button
                size='small'
                type="submit"
                variant="contained"
                color="primary"
              >
                Start a New Game
          </Button>
            </Grid>
          </form>
        </Grid>

      </Paper>
    </Modal>
  )
}

export default GameFinish;