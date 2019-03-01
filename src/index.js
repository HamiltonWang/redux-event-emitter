import Emitter from 'tiny-emitter';

export default class ReduxEventEmitter {
	constructor() {
		this.emitter = new Emitter();
	}

	createEvents(events = {}) {
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

		const self = this;
		return ({ dispatch }) => {
			Object.keys(events).forEach(key => {
				self.emitter.on(key, function() {
					dispatch(events[key](...arguments));
				});
			});

			return function(next) {
				return function(action) {
					if (action.type.startsWith('@@emitter')) {
						self.emitter.emit(action.channel, ...(action.args || []));
					}

					return next(action);
				};
			};
		};
	}

	once(events = {}) {
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

		const self = this;
		return ({ dispatch }) => {
			Object.keys(events).forEach(key => {
				self.emitter.once(key, function() {
					dispatch(events[key](...arguments));
				});
			});

			return function(next) {
				return function(action) {
					return next(action);
				};
			};
		};
	}

	// ------------------------------------
	// emitter Proxies
	// ------------------------------------

	emit(channel) {
		return {
			type: '@@emitter',
			channel,
			args: Array.prototype.slice.call(arguments, 1),
		};
	}

	off(channel) {
		return this.emitter.off(channel);
	}

	on(events = {}) {
		return this.createEvents(events);
	}
}
