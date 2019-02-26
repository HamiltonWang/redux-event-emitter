/* eslint-disable quote-props */
import { applyMiddleware, createStore } from 'redux';
import createEvents, { emit } from '../../';

function exampleReducer (state = {}, action) {
  switch (action.type) {
    case 'IPC_PONG':
      console.log('Pong', action);
      return state;
    case 'IPC_PING':
      console.log('Ping', JSON.stringify(action)); 
      return state;
    default:
      return state;
  }
}

function pongActionCreator ( arg1, arg2, arg3) {
  return {
    type: 'IPC_PONG',
    arg1,
    arg2,
    arg3
  };
}

function pingActionCreator ( arg1 ) {

  return {
    type: 'IPC_PING',
    arg1
  };
}

const ipc = createEvents({
  'pong': pongActionCreator,
  'ping': pingActionCreator
});

const store = createStore(exampleReducer, applyMiddleware(ipc));

store.dispatch(emit('ping', { a:1, b:2, c:3 }));
//emit('ping', { a:1, b:2, c:3 });