/* eslint-disable quote-props */
import { applyMiddleware, createStore } from 'redux';
import createEvents, { emit } from '../../';
import thunk from 'redux-thunk';

function exampleReducer(state = {}, action) {
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

function pongActionCreator(arg1, arg2, arg3) {
	return {
		type: 'IPC_PONG',
		arg1,
		arg2,
		arg3,
	};
}

function pingActionCreator(arg1) {
	return {
		type: 'IPC_PING',
		arg1,
	};
}

const pingAction = (arg1) => dispatch => {
	console.log('...test');
	dispatch(pingActionCreator(arg1));
		
};

const ipc = createEvents({
	'pong': pongActionCreator,
	'ping': pingActionCreator,
	pingAction,
});

const store = createStore(exampleReducer, applyMiddleware(thunk, ipc));

store.dispatch(emit('ping', { a: 122, b: 2, c: 3 }));
store.dispatch(emit('pingAction', { a: 4, b: 5, c: 6 }));
store.dispatch(pingAction({ v:1111 }));
//emit('ping', { a:1, b:2, c:3 });
