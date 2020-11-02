import * as ActionTypes from './actiontypes';
import {createBoard, getOpposition} from '../game-logic/boardUitls';

const defaultBoardSize = 8;

const Board = (state = {
  boardSize: defaultBoardSize,
  board: createBoard(defaultBoardSize),
  highlightCells: [],
  currentPlayer: 'black',
  selectedCell: null
}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_HIGHLIGHT_CELLS:
      return {...state, highlightCells: action.payload, selectedCell: action.selectedCell}
    
    case ActionTypes.CLEAR_HIGHLIGHT_CELLS:
      return {...state, highlightCells: []}
    
    case ActionTypes.CHANGE_CELL_TYPE:
      let newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[action.row][action.col].type = action.type;
      return {...state, board: newBoard}

    case ActionTypes.TOGGLE_CURRENT_PLAYER:
      return {...state, currentPlayer: getOpposition(state.currentPlayer)}

    case ActionTypes.RESET_BOARD:
      return {boardSize: action.boardSize, board: createBoard(action.boardSize), highlightCells: [], currentPlayer: 'black'}
    
    case ActionTypes.MOVE:
      let newBoar = JSON.parse(JSON.stringify(state.board));
      newBoar[state.selectedCell.row][state.selectedCell.col].type = 'empty';
      newBoar[action.row][action.col].type = state.currentPlayer;
      return {...state, board: newBoar, currentPlayer: getOpposition(state.currentPlayer), highlightCells: []}
    default:
      return state;
  }
}

export default Board;