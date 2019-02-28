import Emitter from 'tiny-emitter';
const emitter = new Emitter();

export default function createEvents(events = {}) {
	if (typeof events !== 'object') {
		throw new TypeError(
			`createEvents expects events object as its first parameter, you passed type "${typeof events}"`
		);
	}

	Object.keys(events).forEach(key => {
		if (typeof events[key] !== 'function') {
			throw new TypeError(
				`Each key in createIpc's events object must be a dispatch-able function, key "${key}" is of type "${typeof events[
					key
				]}"`
			);
		}
	});

	return ({ dispatch }) => {
		Object.keys(events).forEach(key => {
			emitter.on(key, function() {
				dispatch(events[key](...arguments));
			});
		});

		return function(next) {
			return function(action) {
				if (action.type.startsWith('@@emitter')) {
					emitter.emit(action.channel, ...(action.args || []));
				}

				return next(action);
			};
		};
	};
}

export function once(events = {}) {
	if (typeof events !== 'object') {
		throw new TypeError(
			`createEvents expects events object as its first parameter, you passed type '${typeof events}"`
		);
	}

	Object.keys(events).forEach(key => {
		if (typeof events[key] !== 'function') {
			throw new TypeError(
				`Each key in createIpc's events object must be a dispatch-able function, key "${key}" is of type "${typeof events[
					key
				]}"`
			);
		}
	});

	return ({ dispatch }) => {
		Object.keys(events).forEach(key => {
			emitter.once(key, function() {
				dispatch(events[key](...arguments));
			});
		});

		return function(next) {
			return function(action) {
				if (action.type.startsWith('@@emitter')) {
					emitter.emit(action.channel, ...(action.args || []));
				}

				return next(action);
			};
		};
	};
}

// ------------------------------------
// emitter Proxies
// ------------------------------------

export function emit(channel) {
	return {
		type: '@@emitter',
		channel,
		args: Array.prototype.slice.call(arguments, 1),
	};
}

export function off(channel) {
	return emitter.off(channel);
}

export { emitter };