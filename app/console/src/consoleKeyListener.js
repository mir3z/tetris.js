import Observable from "../../../src/Observable";
import throttle from "lodash.throttle";

const KEY_LEFT = "left";
const KEY_RIGHT = "right";
const KEY_UP = "up";
const KEY_DOWN = "down";

export default function createKeyListener(stdin) {
    const keyListeners = {};

    const createKeyHandler = () => throttle((chunk, key) => {
        const keyName = key.name;

        if (keyName in keyListeners) {
            keyListeners[keyName].notify(key);
        }
    }, 50);

    return {
        init() {
            stdin.on("keypress", createKeyHandler());
            return this;
        },

        register(keyName, handler) {
            keyListeners[keyName] = keyListeners[keyName] || Observable();
            keyListeners[keyName].register(handler);
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
        }
    };
}
