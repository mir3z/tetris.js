import Observable from "../../../src/Observable";

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_C = 67;
const KEY_SPACE = 32;

export default function createKeyListener(el) {
    const keyListeners = {};

    const createKeyHandler = () => event => {
        const keyCode = event.keyCode;

        if (keyCode in keyListeners) {
            event.preventDefault();
            event.stopPropagation();
            keyListeners[keyCode].notify(event);
        }
    };

    return {
        init() {
            el.addEventListener("keydown", createKeyHandler(), false);

            return this;
        },

        register(keyCode, handler) {
            keyListeners[keyCode] = keyListeners[keyCode] || Observable();
            keyListeners[keyCode].register(handler);
            return this;
        },

        onKeyLeft(handler) {
            return this.register(KEY_LEFT, handler);
        },

        onKeyRight(handler) {
            return this.register(KEY_RIGHT, handler);
        },

        onKeyUp(handler) {
            return this.register(KEY_UP, handler);
        },

        onKeyDown(handler) {
            return this.register(KEY_DOWN, handler);
        },

        onKeyC(handler) {
            return this.register(KEY_C, handler);
        },

        onKeySpace(handler) {
            return this.register(KEY_SPACE, handler);
        }
    };
}