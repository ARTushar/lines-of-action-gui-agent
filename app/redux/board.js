import * as ActionTypes from './actiontypes';
import {createBoard, getOpposition} from '../game-logic/boardUtils';

const defaultBoardSize = 8;

const getMoveType = (type) => type === 'black' ? 'latestBlackMove' : 'latestWhiteMove';

const getCellsType = (type) => type === 'black' ? 'totalBlackCells' : 'totalWhiteCells';


const Board = (state = {
  boardSize: defaultBoardSize,
  board: createBoard(defaultBoardSize),
  highlightCells: [],
  currentPlayer: 'black',
  selectedCell: null,
  totalBlackCells: (defaultBoardSize - 2) * 2,
  totalWhiteCells: (defaultBoardSize - 2) * 2,
  latestBlackMove: null,
  latestWhiteMove: null
}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_HIGHLIGHT_CELLS:
      return {...state, 
        highlightCells: action.payload, 
        selectedCell: action.selectedCell
      }
    
    case ActionTypes.CLEAR_HIGHLIGHT_CELLS:
      return {...state, highlightCells: []}
    
    case ActionTypes.CHANGE_CELL_TYPE:
      let newBoard = JSON.parse(JSON.stringify(state.board));
      newBoard[action.row][action.col].type = action.type;
      return {...state, 
        board: newBoard
      }

    case ActionTypes.TOGGLE_CURRENT_PLAYER:
      return {...state, 
        currentPlayer: getOpposition(state.currentPlayer)
      }

    case ActionTypes.RESET_BOARD:
      return {
        boardSize: action.boardSize, 
        board: createBoard(action.boardSize), 
        highlightCells: [], 
        currentPlayer: 'black', 
        totalBlackCells: (action.boardSize - 2) * 2,
        totalWhiteCells: (action.boardSize - 2) * 2
      }
    
    case ActionTypes.MOVE:
      let newBoar = JSON.parse(JSON.stringify(state.board));
      const oppositionType = getOpposition(state.currentPlayer);
      let latestMoveType = getMoveType(state.currentPlayer);
      let totalCellsType = getCellsType(oppositionType);
      let totalCells = state[totalCellsType]

      if(newBoar[action.row][action.col].type === oppositionType){
        totalCells -= 1;
      }

      newBoar[state.selectedCell.row][state.selectedCell.col].type = 'empty';
      newBoar[action.row][action.col].type = state.currentPlayer;
      return {...state, 
        board: newBoar, 
        currentPlayer: oppositionType, 
        highlightCells: [],
        [latestMoveType]: {
          row: action.row,
          col: action.col
        },
        [totalCellsType]: totalCells
      }
    default:
      return state;
  }
}

export default Board;