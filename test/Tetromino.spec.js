import { expect } from "chai";
import Tetromino, { Block } from "../src/Tetromino";

describe("Tetromino", () => {
    it("exposes all Tetrominos", () => {
        [
            Tetromino.I,
            Tetromino.O,
            Tetromino.T,
            Tetromino.J,
            Tetromino.L,
            Tetromino.S,
            Tetromino.Z
        ].forEach(t => {
            expect(t).to.be.a("function")
        });
    });

    it("moves by given offset", () => {
        const moved = Tetromino(4, 3).moveBy(2, 7);

        expect(moved.row).to.eql(6);
        expect(moved.col).to.eql(10);
    });

    it("falls by one row", () => {
        const fallen = Tetromino(4, 3).fall();

        expect(fallen.row).to.eql(5);
        expect(fallen.col).to.eql(3);
    });

    it("rotates", () => {
        const B = Block(1);
        const rotations = [
            [ B(0, 0), B(0, 1) ],
            [ B(0, 0), B(1, 0) ]
        ];
        const t = Tetromino(0, 0, 0, rotations);

        expect(t.shape).to.eql(rotations[0]);
        expect(t.rotate().shape).to.eql(rotations[1]);
        expect(t.rotate().rotate().shape).to.eql(rotations[0]);
    });

    it("checks whether some blocks met predicate", () =>{
        const t = Tetromino.L(2, 2);

        expect(t.some(({ value }) => value === 5)).to.be.ok;
        expect(t.some(({ row, col }) => col > 3)).to.be.ok;
        expect(t.some(({ row, col }) => col === 0)).not.to.be.ok;
    });

    it("iterates over tetromino's blocks", () => {
        const t = Tetromino.I();

        let blocks = 0;
        t.forEach(() => blocks++);

        expect(blocks).to.eql(4);
    });

    it("iterates over tetromino's block providing relative coordinates", () => {
        const b = Block(5)(1, 2);
        const t = Tetromino(2, 2, 0, [[b]]);

        t.forEach(({ row, col }) => {
            expect(row).to.eql(3);
            expect(col).to.eql(4);
        });
    });
});