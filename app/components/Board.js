import { ButtonGroup } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Cell from './Cell';

function Board() {

  let board = useSelector(state => state.board.board);

  let boardUI = [];

  for(let i = 0; i < board.length; i++){
    boardUI.push(
      <Grid item>
      <ButtonGroup  color='primary'>
        {board[i].map((val, j) =>(
          <Cell type={val.type}
            row={i}
            col={j}
          />
        ))}
        </ButtonGroup>
        </Grid>
    )
  }

  return (
    <div style={{
    }}>
      <Grid 
        container 
        justify="center"
      >
      {boardUI}
      </Grid>
    </div>
  )
}

export default Board;
