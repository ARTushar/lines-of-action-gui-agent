import * as ActionTypes from './actiontypes';

const Game = (state = {
  firstPlayerName: '',
  secondPlayerName: '',
  firstPlayerType: '',
  secondPlayerType: '',
  totalTimeTaken: null,
  winner: ''
}, action) => {
  switch(action.type){
    case ActionTypes.SET_PLAYER_NAMES:
      return {
        ...state,
        firstPlayerName: action.firstPlayerName,
        secondPlayerName: action.secondPlayerName,
        firstPlayerType: action.firstPlayerType,
        secondPlayerType: action.secondPlayerType,
        winner: '',
        totalTimeTaken: null
      }
    case ActionTypes.SET_TOTAL_TIME:
      return {
        ...state,
        totalTimeTaken: action.payload
      }

    case ActionTypes.FINISH_GAME:
      return {
        ...state,
        totalTimeTaken: action.totalTimeTaken,
        winner: action.winner
      }
    default:
      return state;
  }
}

export default Game;