'use strict';

class MyEventEmitter {
  constructor() {
    this._events = {};
  }

  _addListener(event, listener, once) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].push({ listener, once });
  }

  on(event, listener) {
    this._addListener(event, listener, false);

    return this;
  }

  once(event, listener) {
    this._addListener(event, listener, true);

    return this;
  }

  off(event, listener) {
    const listeners = this._events[event];

    if (!listeners) {
      return this;
    }

    this._events[event] = listeners.filter(
      (entry) => entry.listener !== listener,
    );

    if (this._events[event].length === 0) {
      delete this._events[event];
    }

    return this;
  }

  emit(event, ...args) {
    const listeners = this._events[event];

    if (!listeners) {
      return false;
    }

    const remaining = [];

    for (const entry of [...listeners]) {
      entry.listener(...args);

      if (!entry.once) {
        remaining.push(entry);
      }
    }

    if (remaining.length > 0) {
      this._events[event] = remaining;
    } else {
      delete this._events[event];
    }

    return true;
  }

  _prepend(event, listener, once) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].unshift({ listener, once });
  }

  prependListener(event, listener) {
    this._prepend(event, listener, false);

    return this;
  }

  prependOnceListener(event, listener) {
    this._prepend(event, listener, true);

    return this;
  }

  removeAllListeners(event) {
    if (event) {
      delete this._events[event];
    } else {
      this._events = {};
    }

    return this;
  }

  listenerCount(event) {
    return this._events[event]?.length || 0;
  }
}

module.exports = MyEventEmitter;
