export default function Board(width, height, landed) {

    return {
        landed,
        width,
        height,

        get fullLines() {
            return landed
                .filter(row => row.full)
                .length;
        },

        collides(tetromino) {
            const outside = ({ row, col }) => col < 0 || col > width - 1 || row > height - 1 || row < 0;
            const overlap = ({ row, col }) => !!landed[row].cell(col).get();

            return tetromino.some(block => outside(block) || overlap(block));
        },

        land(tetromino) {
            const nextLanded = landed.map(row => row.clone());

            tetromino.forEach(({ value, row, col }) => {
                nextLanded[row] = nextLanded[row].cell(col).set(value);
            });

            return Board(width, height, nextLanded);
        },

        clearLines() {
            const nextLanded = landed.reduce((acc, row) => {
                return row.full
                    ? [Board.Row.empty(width)].concat(acc)
                    : acc.concat([row]);
            }, []);

            return Board(width, height, nextLanded);
        }
    }
}

Board.empty = (width, height) => Board(width, height, new Array(height).fill(0).map(row => Board.Row.empty(width)));

Board.Row = function (cells) {

    return {
        cells,

        size: cells.length,
        full: cells.every(cell => !!cell),

        cell: col => ({
            get: () => cells[col],

            set: value => {
                const newCells = [
                    ...cells.slice(0, col),
                    value,
                    ...cells.slice(col + 1)
                ];

                return Board.Row(newCells);
            }
        }),

        clone: () => Board.Row(cells.map(cell => cell)),

        map: fn => Board.Row(cells.map(fn))
    }
};

Board.Row.empty = size => Board.Row(new Array(size).fill(0));
