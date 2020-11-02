import * as ActionTypes from './actiontypes';

const Game = (state = {
  firstPlayerName: '',
  secondPlayerName: '',
  totalTimeTaken: null,

}, action) => {
  switch(action.type){
    case ActionTypes.SET_PLAYER_NAMES:
      return {
        ...state,
        firstPlayerName: action.firstPlayerName,
        secondPlayerName: action.secondPlayerName
      }
    case ActionTypes.SET_TOTAL_TIME:
      return {
        ...state,
        totalTimeTaken: action.payload
      }
    default:
      return state;
  }
}

export default Game;