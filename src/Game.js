import Observable from "./Observable";

export default function Game(keyListener, wait, tetris) {
    let state = {
        tetris
    };

    const TICK_TIME = 1000;

    const updatable = Observable();

    const update = nextState => {
        state = {
            ...state,
            ...nextState
        };

        updatable.notify(state);

        return state;
    };

    const move = ({ x, y }) => landing => landing.moveBy(y, x);
    const rotate = () => landing => landing.rotate();
    const movement = ({ tetris }, getNextLanding) => {
        return {
            tetris: tetris.spawn(getNextLanding(tetris.landing))
        };
    };
    const store = ({ tetris }) => {
        return {
            tetris: tetris.storeCurrent()
        }
    }
    const instantPlace = ({ tetris }) => {
        return {
            tetris: tetris.placeCurrent()
        }
    }

    const step = () => {
        const { tetris } = state;
        const nextTetris = tetris.step();

        if (nextTetris.totalLinesCleared > tetris.totalLinesCleared) {
            update({ clearing: true });

            wait(TICK_TIME)
                .then(() => update({ tetris: nextTetris, clearing: false }))
                .then(() => wait(TICK_TIME * nextTetris.speed))
                .then(step);

            return;
        }

        if (nextTetris.lost) {
            update({ tetris: nextTetris });
            return;
        }

        update({ tetris: nextTetris });
        wait(TICK_TIME * nextTetris.speed).then(step);
    };

    return {
        state,

        onUpdate(fn) {
            updatable.register(fn);
        },

        start() {
            const input = ({ x = 0, y = 0, stored = false, space = false }) => () => {
                let nextState;

                if (stored) {
                    nextState = store(state);
                } else if (space) {
                    nextState = instantPlace(state);
                } else {
                    nextState = (y === -1)
                        ? movement(state, rotate())
                        : movement(state, move({ x, y }));
                }

                update(nextState);
            };

            keyListener
                .init()
                .onKeyLeft(input({ x: -1 }))
                .onKeyRight(input({ x: 1 }))
                .onKeyUp(input({ y: -1 }))
                .onKeyDown(input({ y: 1 }))
                .onKeyC(input({ stored: true }))
                .onKeySpace(input({ space: true }));

            wait(TICK_TIME).then(step);
        }
    }
}