import Random from "./Random";

export default function Tetromino(row = 0, col = 0, rotation = 0, rotations = []) {
    const norm = rot => rot % rotations.length;
    const nextRotation = () => norm(rotation + 1);
    const relative = block => Block(block.value)(row + block.row, col + block.col);
    const shape = rotations[norm(rotation)];

    return {
        row,
        col,
        shape,

        moveBy(rows, cols) {
            return Tetromino(row + rows, col + cols, rotation, rotations);
        },

        fall() {
            return this.moveBy(1, 0);
        },

        rotate() {
            return Tetromino(row, col, nextRotation(), rotations);
        },

        some(fn) {
            return shape.some(block => fn(relative(block)));
        },

        forEach(fn) {
            shape.forEach(block => fn(relative(block)));
        }
    };
}

export const Block = value => (row, col) => ({ value, row, col });

Tetromino.I = (row, col, rotation) => {
    const I = Block(1);

    const rotations = [
        [ I(1, 0), I(1, 1), I(1, 2), I(1, 3) ],
        [ I(0, 2), I(1, 2), I(2, 2), I(3, 2) ],
        [ I(2, 0), I(2, 1), I(2, 2), I(2, 3) ],
        [ I(0, 1), I(1, 1), I(2, 1), I(3, 1) ]
    ];

    return Tetromino(row, col, rotation, rotations);
};

Tetromino.O = (row, col, rotation) => {
    const O = Block(2);

    const rotations = [
        [ O(1, 1), O(1, 2), O(2, 1), O(2, 2) ]
    ];

    return Tetromino(row, col, rotation, rotations);
};

Tetromino.T = (row, col, rotation) => {
    const T = Block(3);

    const rotations = [
        [ T(0, 1), T(1, 0), T(1, 1), T(1, 2) ],
        [ T(0, 1), T(1, 1), T(1, 2), T(2, 1) ],
        [ T(1, 0), T(1, 1), T(1, 2), T(2, 1) ],
        [ T(0, 1), T(1, 0), T(1, 1), T(2, 1) ]
    ];

    return Tetromino(row, col, rotation, rotations);
};

Tetromino.J = (row, col, rotation) => {
    const J = Block(4);

    const rotations = [
        [ J(0, 0), J(1, 0), J(1, 1), J(1, 2) ],
        [ J(0, 1), J(0, 2), J(1, 1), J(2, 1) ],
        [ J(1, 0), J(1, 1), J(1, 2), J(2, 2) ],
        [ J(0, 1), J(1, 1), J(2, 0), J(2, 1) ]
    ];

    return Tetromino(row, col, rotation, rotations);
};

Tetromino.L = (row, col, rotation) => {
    const L = Block(5);

    const rotations = [
        [ L(1, 0), L(1, 1), L(1, 2), L(0, 2) ],
        [ L(0, 1), L(1, 1), L(2, 1), L(2, 2) ],
        [ L(1, 0), L(1, 1), L(1, 2), L(2, 0) ],
        [ L(0, 0), L(0, 1), L(1, 1), L(2, 1) ]
    ];

    return Tetromino(row, col, rotation, rotations);
};

Tetromino.S = (row, col, rotation) => {
    const S = Block(6);

    const rotations = [
        [ S(1, 1), S(1, 2), S(2, 0), S(2, 1) ],
        [ S(0, 1), S(1, 1), S(1, 2), S(2, 2) ]
    ];

    return Tetromino(row, col, rotation, rotations);
};

Tetromino.Z = (row, col, rotation) => {
    const Z = Block(7);

    const rotations = [
        [ Z(1, 0), Z(1, 1), Z(2, 1), Z(2, 2) ],
        [ Z(0, 2), Z(1, 1), Z(1, 2), Z(2, 1) ]
    ];

    return Tetromino(row, col, rotation, rotations);
};

Tetromino.Stream = seed => {
    const rng = Random(~~seed);

    const tetrominos = [
        Tetromino.I,
        Tetromino.O,
        Tetromino.T,
        Tetromino.J,
        Tetromino.L,
        Tetromino.S,
        Tetromino.Z
    ];

    const create = num => tetrominos[num % tetrominos.length]();

    return {
        next() {
            return create(rng.next());
        },

        peek() {
            return create(rng.peek());
        }
    };
};

Tetromino.Stream.Random = () => {
    const randomSeed = Math.floor(Math.random() * 99999);
    return Tetromino.Stream(randomSeed);
};
