import * as ActionTypes from './actiontypes';

/**
 * board
 */

export const highlightAvailableMoves = (highlightCells, selectedCell) => ({
  type: ActionTypes.ADD_HIGHLIGHT_CELLS,
  payload: highlightCells,
  selectedCell
})

export const move = (row, col) => ({
  type: ActionTypes.MOVE,
  row,
  col
})

export const createBoard = (boardSize) => ({
  type: ActionTypes.RESET_BOARD,
  boardSize
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

export const setPlayerNames = (firstPlayerName, secondPlayerName) => ({
  type: ActionTypes.SET_PLAYER_NAMES,
  firstPlayerName,
  secondPlayerName
})

export const startGame = (firstPlayerName, secondPlayerName, firstPlayerType, secondPlayerType, boardSize) => (dispatch) => {
  dispatch(setPlayerNames(firstPlayerName, secondPlayerName, firstPlayerType, secondPlayerType));
  dispatch(createBoard(boardSize));
  dispatch(startTimer());
}

export const finishGame = (winner, totalTimeTaken) => ({
  type: ActionTypes.FINISH_GAME,
  winner,
  totalTimeTaken
})