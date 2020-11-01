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