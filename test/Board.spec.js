import { expect } from "chai";
import Board from "../src/Board";
import Tetromino from "../src/Tetromino";

describe("Board", () => {
    describe("Board.Row", () => {
        it("wraps a row of cells", () => {
            const cells = [1, 2, 3];
            const row = Board.Row(cells);

            expect(row.cells).to.eql(cells);
            expect(row.size).to.eql(cells.length);
        });

        it("tells whether row is full", () => {
            expect(Board.Row([1, 1, 1, 1]).full).to.be.ok;
            expect(Board.Row([0, 1, 1, 1]).full).not.to.be.ok;
        });

        it("reads reads a cell at given column", () => {
            expect(Board.Row([1, 2, 3, 4]).cell(2).get()).to.eql(3);
        });

        it("sets a cell at given column ad returns a new Board", () => {
            const row = Board.Row([1, 2, 3]);
            const newRow = row.cell(2).set(100);

            expect(newRow.cell(2).get()).to.eql(100);
            expect(row).not.to.equal(newRow);
        });

        it("clones a row", () => {
            const row = Board.Row([1, 3, 6]);
            const cloned = row.clone();

            expect(row).not.to.equal(cloned);
            expect(cloned.cells).to.eql(row.cells);
        });

        it("maps row", () => {
            const row = Board.Row([1, 2, 3]);
            const mapped = row.map(cell => cell + 10);

            expect(mapped.cells).to.eql([11, 12, 13]);
            expect(mapped).not.to.equal(row);
        });

        it("create an empty row if given size", () => {
            const row = Board.Row.empty(4);
            expect(row.cells).to.eql([0, 0, 0, 0]);
        });
    });

    it("creates a board", () => {
        const width = 3;
        const height = 2;
        const landed = [Board.Row([1, 2, 3]), Board.Row([4, 5, 6])];
        const board = Board(width, height, landed);

        expect(board.width).to.eql(width);
        expect(board.height).to.eql(height);
        expect(board.landed).to.eql(landed);
    });

    it("returns a number of full landed lines", () => {
        const landed = [
            Board.Row([0, 0]),
            Board.Row([0, 1]),
            Board.Row([1, 1])
        ];
        const board = Board(2, 3, landed);

        expect(board.fullLines).to.eql(1);
    });

    it("checks whether tetromino collides with landed blocks", () => {
        const landed = [
            Board.Row([0, 0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0, 1]),
            Board.Row([0, 0, 0, 0, 1, 1]),
            Board.Row([0, 0, 0, 1, 1, 1]),
            Board.Row([0, 1, 1, 1, 1, 1])
        ];

        const board = Board(6, 6, landed);

        expect(board.collides(Tetromino.I(0, 2))).not.to.be.ok;
        expect(board.collides(Tetromino.I(1, 2))).to.be.ok;
        expect(board.collides(Tetromino.I(4, 0))).to.be.ok;
    });

    it("checks whether tetromino collides with borders", () => {
        const landed = [
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0])
        ];

        const board = Board(5, 5, landed);

        expect(board.collides(Tetromino.I(1, 1))).not.to.be.ok;
        expect(board.collides(Tetromino.I(1, 2))).to.be.ok;
        expect(board.collides(Tetromino.I(1, -1))).to.be.ok;
        expect(board.collides(Tetromino.I(-3, 1))).to.be.ok;
        expect(board.collides(Tetromino.I(5, 1))).to.be.ok;
    });

    it("makes tetromino landed and returns a new board", () => {
        const landed = [
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0])
        ];

        const board = Board(5, 5, landed);
        const landing = Tetromino.I(3, 1);
        const boardWithLanded = board.land(landing);

        expect(board).not.to.equal(boardWithLanded);
        expect(boardWithLanded.landed.map(row => row.cells)).to.eql([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1]
        ]);
    });

    it("clears full lines and returns a new board", () => {
        const landed = [
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 1, 1]),
            Board.Row([1, 1, 1, 1, 1]),
            Board.Row([1, 1, 1, 1, 1])
        ];

        const board = Board(5, 5, landed).clearLines();

        expect(board.landed.map(row => row.cells)).to.eql([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1]
        ]);
    });

    it("creates an empty board of given size", () => {
        const board = Board.empty(3, 3);

        expect(board.landed.map(row => row.cells)).to.eql([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]);
    });
});