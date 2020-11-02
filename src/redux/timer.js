import * as ActionTypes from './actiontypes';

const Timer = (state = {
  startedAt: null,
  stoppedAt: null,
  baseTime: 0
}, action) => {
  switch(action.type){
    case ActionTypes.START_TIMER:
      return {...state, 
        baseTime: action.baseTime,
        startedAt: action.now,
        stoppedAt: null  
      }
    case ActionTypes.STOP_TIMER:
      return {
        ...state,
        stoppedAt: action.now
      }
    case ActionTypes.RESET_TIMER:
      return {
        baseTime: 0,
        startedAt: state.startedAt ? action.now: null,
        stoppedAt: state.stoppedAt ? action.now: null
      }
    default:
      return state;
  }
}

export default Timer;