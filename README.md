# Redux-Event-Emitter Middleware
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mariotacke/redux-event-emitter/master/LICENSE)

A [Redux](https://github.com/reactjs/redux) middleware to reduce only one line of code (you don't have to import specific action). Instead I change it to an emitter do that you can fire events with a simple api. Why so? I migrate some code from Electron to React Native so I want to keey the strusture of code unchanged. So this is a replacement for Redux-Electron-IPC.

## Install

### [npm](https://www.npmjs.com/package/redux-event-emitter)
```sh
npm install --save redux-event-emitter
```

## Usage
Check out the full [demo](https://github.com/HamiltonWang/redux-event-emitter/tree/master/example)
application.

### Usage
```js
import { applyMiddleware, createStore } from 'redux';
import createEvents, { emit } from 'redux-event-emitter';
import { pingActionCreator } from './actions';
import { exampleReducer } from './reducer';

// register an action creator to an event
const _events = createEvents({
  'ping': pingActionCreator, // receive a message
  ...
});

const store = createStore(exampleReducer, applyMiddleware(_events));

// emit a message with arguments through the `emit` utility function
// emit(channel, paramter)
store.dispatch(emit('ping', { a:1, b:3, c:5 }));
```

### Action
```js
...
function pingActionCreator ( arg1 ) {

  return {
    type: 'IPC_PING',
    arg1
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
import { emit } from 'redux-event-emitter';

store.dispatch(emit('event channel', ...args));
```

#### Receiving an reducers event
To receive events, register a channel response when configuring the middleware.
e.g. include all your action functions into createEvents so that all can be called by using emitter.

### example
```js
const ipc = createIpc({
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
const ipc = createEvents({
  'ipc channel name': () => dispatch =>
    dispatch({ type: 'DELAYED_ACTION_TYPE' })
});
const store = createStore(exampleReducer, applyMiddleware(thunk, ipc));
```

## Questions
For any questions, please open an [issue](https://github.com/HamiltonWang/redux-event-emitter/issues).
Pull requests (with tests) are appreciated.
