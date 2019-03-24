# Redux-Event-Emitter Middleware
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mariotacke/redux-event-emitter/master/LICENSE) [![npm version](https://badge.fury.io/js/redux-event-emitter.svg)](https://badge.fury.io/js/redux-event-emitter)

A [Redux](https://github.com/reactjs/redux) middleware to reduce only one line of code (you don't have to import specific action). Instead I change it to an emitter so that you can fire events with a simple api. Why so? I migrate some code from Electron to React Native so I want to keey the strusture of code unchanged. So this is a replacement (inspired) for Redux-Electron-IPC. With this libray, you may refactor your electron code and reat native code into a common shared code and refactor out Electron's IPC(possibly).

## Install

### [npm](https://www.npmjs.com/package/redux-event-emitter)
```sh
npm install --save redux-event-emitter
```

## Working Demo Example
Check out the full [demo](https://github.com/HamiltonWang/redux-event-emitter/tree/master/example)
application.

### Usage
```js
import { applyMiddleware, createStore } from 'redux';
import { reduxEventEmitter } from 'redux-event-emitter';
import { pingActionCreator } from './actions';
import { exampleReducer } from './reducer';

// register an action creators to an event
const ipc = reduxEventEmitter.createEvents({
  'ping': pingActionCreator, // receive a message
  ...
});

// and/or if you want once
const ipc2 = reduxEventEmitter.once({
  pongActionCreator, // another way of writing it if you don't want a different key
  ...
});

const store = createStore(exampleReducer, applyMiddleware(ipc, ipc2));

// emit a message with arguments through the `emit` utility function
// emit(channel, paramter)
store.dispatch(reduxEventEmitter.emit('ping', { a:1, b:3, c:5 }));

// disable it
reduxEventEmitter.off('ping');
```

### Action
```js
...
function pingActionCreator ( arg1, arg2 ) {

  return {
    type: 'IPC_PING',
    arg1,
    arg2
  };
}
...
```

### Reducer
```js
...
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
...
```


### Events
The key designates the `events-emitter` channel; the value is a redux action
creator to be dispatched.

```js
{
  'channel name': (...args) => {
    return {
      type: 'YOUR_ACTION_TYPE',
      ... optional mapping of arguments ...
    }
  }
}
```

### Examples

#### Sending an event
Use the utility function `emit` to issue an event-emitter message. The
method signature is the same as ipcRenderer's send.

Behind the scenes, the  middleware will trigger the tiny-emitter on the given channel with any number of arguments.

```js
import { reduxEventEmitter } from 'redux-event-emitter';

store.dispatch(reduxEventEmitter.emit('event channel', ...args));
```

#### Receiving an reducers event
To receive events, register a channel response when configuring the middleware.
e.g. include all your action functions into createEvents so that all can be called by using reduxEventEmitter.

### example
```js
const ipc = reduxEventEmitter.createEvents({
  receiveLocale, //<-- first action function
  lndSyncStatus, //<-- second action function
  ...
});

const store = createStore(exampleReducer, applyMiddleware(ipc));
```
### action function
```js
...
export const receiveLocale = (locale) => dispatch => {
  dispatch(setLocale(locale))
}
...
```

## What about `redux-thunk`?
`redux-event-emitter` supports thunks out of the box as long as you install `redux-thunk` and apply the thunk middleware before the ipc middleware.

### Example
```js
const ipc = reduxEventEmitter.createEvents({
  'ipc channel name': () => dispatch =>
    dispatch({ type: 'DELAYED_ACTION_TYPE' })
});
const store = createStore(exampleReducer, applyMiddleware(thunk, ipc));
```

## Questions
For any questions, please open an [issue](https://github.com/HamiltonWang/redux-event-emitter/issues).
Pull requests (with tests) are appreciated.
