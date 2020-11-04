import * as ActionTypes from './actiontypes';
import { spawn } from 'child_process';
import path from 'path';
import { createBoard, getBoardForBot } from '../game-logic/boardUtils';
import { getValidMoves, isValidMove } from '../game-logic/validMoves';
/**
 * board
 */

export const highlightAvailableMoves = (highlightCells, selectedCell) => ({
  type: ActionTypes.ADD_HIGHLIGHT_CELLS,
  payload: highlightCells,
  selectedCell
})

export const setSelectedCell = (selectedCell) => ({
  type: ActionTypes.SET_SELECTED_CELL,
  selectedCell
})

export const move = (row, col) => ({
  type: ActionTypes.MOVE,
  row,
  col
})


export const setBoard = (board) => ({
  type: ActionTypes.RESET_BOARD,
  board
})

/**
 * timer
 */

export const startTimer = () => ({
  type: ActionTypes.START_TIMER,
  now: new Date()
})

export const stopTimer = () => ({
  type: ActionTypes.STOP_TIMER,
  now: new Date()
})

export const resetTimer = () => ({
  type: ActionTypes.RESET_TIMER
})

/**
 * game 
 */

export const changeHasBotMove = (botType) => ({
  type: ActionTypes.CHANGE_HAS_BOT_MOVE,
  botType,
})


export const setGame = (firstPlayerName, secondPlayerName, firstPlayerType, secondPlayerType, subProcess1, subProcess2) => ({
  type: ActionTypes.SET_PLAYER_NAMES,
  firstPlayerName,
  secondPlayerName,
  firstPlayerType,
  secondPlayerType,
  subProcess1,
  subProcess2
})

const handleOutputBot = (data, board, type) => (dispatch) => {
  console.log(data.toString());
  let output = data.toString().split(/[ \t]+/).map(val => parseInt(val));
  let selectedCell, moveRow, moveCol;
  if (output.length === 4) {
    selectedCell = { row: output[0], col: output[1] };
    moveRow = output[2];
    moveCol = output[3];
    dispatch(setSelectedCell(selectedCell));
    dispatch(move(moveRow, moveCol));
  } else {
    console.log(output.length);
    console.log('invalid output format');
  }
}

export const sendBoardToBot = (board, subProcess) => {
  const botBoard = getBoardForBot(board);
  console.log(botBoard);
  subProcess.stdin.write(botBoard);
}

export const startGame = (firstPlayerName, secondPlayerName, firstPlayerType, secondPlayerType, boardSize) => (dispatch) => {

  const board = createBoard(boardSize);
  console.log(firstPlayerType, secondPlayerType);
  let subProcess1, subProcess2;
  if (firstPlayerType === 'bot') {
    subProcess1 = spawn(
      path.join(__dirname, 'bot', 'player1'),
      ['b', boardSize.toString()]
    )
    console.log('created the first subprocess');
   
    subProcess1.stdout.on('data', (data) => {
      dispatch(handleOutputBot(data, board, 'black'));
      dispatch(changeHasBotMove('hasBot1Move'))
    })

    subProcess1.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    subProcess1.on('close', (code) => {
      console.log(`child process 1 exited with code ${code}`);
    });
  }

  if (secondPlayerType === 'bot') {
    console.log('created the second subprocess');

    subProcess2 = spawn(
      path.join(__dirname, 'bot', 'player1'),
      ['r', boardSize.toString()]
    )

    subProcess2.stdout.on('data', (data) => {
      dispatch(handleOutputBot(data, board, 'white'));
      dispatch(changeHasBotMove('hasBot2Move'))
    })

    subProcess2.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    subProcess2.on('close', (code) => {
      console.log(`child process 2 exited with code ${code}`);
    });
  }

  dispatch(setGame(firstPlayerName, secondPlayerName, firstPlayerType, secondPlayerType, subProcess1, subProcess2));
  dispatch(setBoard(board));
  dispatch(startTimer());
  if (subProcess1) {
    sendBoardToBot(board, subProcess1);
    dispatch(changeHasBotMove('hasBot1Move'))
  }
}

export const finishGame = (winner, totalTimeTaken) => ({
  type: ActionTypes.FINISH_GAME,
  winner,
  totalTimeTaken
})

export const setErrMess = (errMess) => ({
  type: ActionTypes.SET_ERR_MESS,
  errMess
})