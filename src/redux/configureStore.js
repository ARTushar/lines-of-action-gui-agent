import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import Board from './board';



const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
    board: Board 
  }),
  applyMiddleware(thunk, logger)
  );

  return store;
}

export default ConfigureStore;