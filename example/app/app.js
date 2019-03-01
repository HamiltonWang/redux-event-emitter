/* eslint-disable quote-props */
import { applyMiddleware, createStore } from 'redux';
import ReduxEventEmitter from '../../';
import thunk from 'redux-thunk';
const ee = new ReduxEventEmitter();

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
	dispatch(pingActionCreator(arg1));	
};

const ipc = ee.createEvents({
	'pong': pongActionCreator,
	'ping': pingActionCreator
});

const ipc2 = ee.once( { pingAction });

const store = createStore(exampleReducer, applyMiddleware(thunk, ipc, ipc2));

store.dispatch(ee.emit('ping', { a: 122, b: 2, c: 3 }));
store.dispatch(ee.emit('pingAction', { a: 1, b: 5, c: 6 }));
store.dispatch(ee.emit('pingAction', { a: 1, b: 5, c: 6 })); // second time is useless