import { expect } from "chai";
import Tetris, { calcScore } from "../src/Tetris";
import Board from "../src/Board";
import Tetromino from "../src/Tetromino";

describe("Tetris", () => {

    it("spawns given tetromino if it doesn't collide with existing blocks", () => {
        const board = Board.empty(5, 5);
        const I = Tetromino.I(0, 0);
        const tetris = Tetris(board);

        const afterSpawning = tetris.spawn(I);

        expect(afterSpawning.landing).to.equal(I);
        expect(afterSpawning).not.to.equal(tetris);
    });

    it("does not spawn tetromino if it collides", () => {
        const board = Board.empty(5, 5);
        const I = Tetromino.I(0, 4);
        const tetris = Tetris(board);

        const afterSpawning = tetris.spawn(I);

        expect(afterSpawning).to.equal(tetris);
        expect(afterSpawning.landing).not.to.equal(I);
    });

    it("does not spawn tetromino if game is lost", () => {
        const board = Board.empty(5, 5);
        const I = Tetromino.I(0, 4);
        const tetris = Tetris(board, null, null, 0, 0, true);

        const afterSpawning = tetris.spawn(I);

        expect(afterSpawning).to.equal(tetris);
        expect(afterSpawning.landing).not.to.equal(I);
    });

    it("makes tetromino fall one row if it does not collide", () => {
        const board = Board.empty(5, 5);
        const I = Tetromino.I(0, 0);
        const tetris = Tetris(board, I);

        const nextTetris = tetris.step();

        expect(nextTetris.landing.row).to.eql(1);
        expect(nextTetris.landing.col).to.eql(0);
    });

    it("makes the game lost if landing tetromino collides at the very top", () => {
        const landed = [
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([1, 1, 1, 0, 1]),
            Board.Row([1, 1, 0, 1, 1]),
            Board.Row([1, 1, 1, 0, 1])
        ];
        const board = Board(5, 4, landed);
        const I = Tetromino.I(0, 0);
        const tetris = Tetris(board, I);

        const nextTetris = tetris.step();

        expect(nextTetris.lost).to.be.ok;
    });

    it("makes tetromino landed if it collides with landed blocks", () => {
        const landed = [
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 1, 1, 1, 0])
        ];
        const board = Board(5, 5, landed);
        const I = Tetromino.I(2, 0);
        const nextTetromino = Tetromino.T();
        const fakeTetrominoStream = { next: () => nextTetromino };
        const tetris = Tetris(board, I, fakeTetrominoStream);

        const nextTetris = tetris.step();

        expect(nextTetris.board.landed.map(row => row.cells)).to.eql([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [0, 1, 1, 1, 0]
        ]);
        expect(nextTetris.landing.shape).to.eql(nextTetromino.shape);
    });

    it("clears full lines after landing a tetromino", () => {
        const landed = [
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 0]),
            Board.Row([0, 0, 0, 0, 1])
        ];
        const board = Board(5, 5, landed);
        const I = Tetromino.I(3, 0);
        const fakeTetrominoStream = { next: Tetromino.I };
        const tetris = Tetris(board, I, fakeTetrominoStream);

        const nextTetris = tetris.step();

        expect(nextTetris.totalLinesCleared).to.eql(1);
        expect(nextTetris.board.fullLines).to.eql(0);
        expect(nextTetris.board.landed.map(row => row.cells)).to.eql([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]);
    });

    it("advances to the next level after clearing each 10 lines", () => {
        const linesCleared = n => Tetris(null, null,  null, n);

        expect(linesCleared(0).level).to.eql(0);
        expect(linesCleared(9).level).to.eql(0);
        expect(linesCleared(10).level).to.eql(1);
        expect(linesCleared(19).level).to.eql(1);
        expect(linesCleared(20).level).to.eql(2);
    });

    it("decreases tick time every next level", () => {
        const atLevel = n => Tetris(null, null, null, n * 10);

        expect(atLevel(1).speed).to.be.below(atLevel(0).speed);
        expect(atLevel(2).speed).to.be.below(atLevel(1).speed);
        expect(atLevel(3).speed).to.be.below(atLevel(2).speed);
    });

    describe("scoring system", () => {
        it("scores 40 * (level + 1) points if 1 line has been cleared", () => {
            expect(calcScore(0, 1)).to.eql(40);
            expect(calcScore(1, 1)).to.eql(80);
        });

        it("scores 100 * (level + 1) points if 2 lines have been cleared", () => {
            expect(calcScore(0, 2)).to.eql(100);
            expect(calcScore(1, 2)).to.eql(200);
        });

        it("scores 300 * (level + 1) points if 3 lines have been cleared", () => {
            expect(calcScore(0, 3)).to.eql(300);
            expect(calcScore(1, 3)).to.eql(600);
        });

        it("scores 300 * (level + 1) points if 4 lines have been cleared", () => {
            expect(calcScore(0, 4)).to.eql(1200);
            expect(calcScore(1, 4)).to.eql(2400);
        });

        it("scores 0 points if 0 lines have been cleared", () => {
            expect(calcScore(100, 0)).to.eql(0);
        });
    });
});