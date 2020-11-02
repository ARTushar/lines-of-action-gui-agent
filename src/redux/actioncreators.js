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


/**
 * timer
 */

export const startTimer = (baseTime = 0) => ({
  type: ActionTypes.START_TIMER,
  baseTime,
  now: new Date()
})

export const stopTimer = () => ({
  type: ActionTypes.STOP_TIMER,
  now: new Date()
})

export const resetTimer = () => ({
  type: ActionTypes.RESET_TIMER,
  now: new Date()
})