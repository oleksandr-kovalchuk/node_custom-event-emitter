'use strict';

class MyEventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].push({ listener, once: false });

    return this;
  }

  once(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].push({ listener, once: true });

    return this;
  }

  off(event, listener) {
    const listeners = this._events[event];

    if (!listeners) {
      return this;
    }

    const index = listeners.findIndex((entry) => entry.listener === listener);

    if (index !== -1) {
      listeners.splice(index, 1);

      if (listeners.length === 0) {
        delete this._events[event];
      }
    }

    return this;
  }

  emit(event, ...args) {
    const listeners = this._events[event];

    if (!listeners) {
      return false;
    }

    const listenersCopy = listeners.slice();

    for (const entry of listenersCopy) {
      entry.listener(...args);

      if (entry.once) {
        const index = this._events[event].indexOf(entry);

        if (index !== -1) {
          this._events[event].splice(index, 1);
        }
      }
    }

    if (this._events[event] && this._events[event].length === 0) {
      delete this._events[event];
    }

    return true;
  }

  prependListener(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].unshift({ listener, once: false });

    return this;
  }

  prependOnceListener(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }

    this._events[event].unshift({ listener, once: true });

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
    return this._events[event] ? this._events[event].length : 0;
  }
}

module.exports = MyEventEmitter;
